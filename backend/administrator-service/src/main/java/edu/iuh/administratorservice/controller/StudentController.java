package edu.iuh.administratorservice.controller;
import edu.iuh.AuthInfo;
import edu.iuh.RegisterRequest;
import edu.iuh.RegisterServiceGrpc;
import edu.iuh.administratorservice.dto.FileNameDTO;
import edu.iuh.administratorservice.dto.StudentCreateDTO;
import edu.iuh.administratorservice.entity.Student;
import edu.iuh.administratorservice.repository.ClassesRepository;
import edu.iuh.administratorservice.repository.StudentRepository;
import edu.iuh.administratorservice.serialization.ExcelFileHandle;
import edu.iuh.administratorservice.serialization.JsonConverter;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/student")
@Controller
@Slf4j
public class StudentController {
    private final StudentRepository studentRepository;
    private final JsonConverter jsonConverter;
    private final ExcelFileHandle excelFileHandle;
    private final ClassesRepository classesRepository;

    public StudentController(StudentRepository studentRepository, JsonConverter jsonConverter, ExcelFileHandle excelFileHandle, ClassesRepository classesRepository) {
        this.studentRepository = studentRepository;
        this.jsonConverter = jsonConverter;
        this.excelFileHandle = excelFileHandle;
        this.classesRepository = classesRepository;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody FileNameDTO info){
        log.info("### enter api.v1.student  ###");
        log.info("# info: {} #", info);

        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9090)
                .usePlaintext()
                .build();

        RegisterServiceGrpc.RegisterServiceStub stub = RegisterServiceGrpc.newStub(channel);

        List<StudentCreateDTO> studentCreates = excelFileHandle.toStudentCreate(info.getFileName());
        return Flux.fromIterable(studentCreates)
                .flatMap(studentCreateDTO -> classesRepository.findById(studentCreateDTO.getClassesID())
                        .switchIfEmpty(Mono.error(new RuntimeException("Fail find classes")))
                        .flatMap(classes -> Mono.create(sink ->{
                                    RegisterRequest request = RegisterRequest.newBuilder().build();
                                    stub.registerStudent(request, new StreamObserver<AuthInfo>() {
                                        @Override
                                        public void onNext(AuthInfo value) {
                                            sink.success(value);
                                        }

                                        @Override
                                        public void onError(Throwable t) {
                                            log.error("# {} #", "Fail stub");
                                            sink.error(t);
                                        }

                                        @Override
                                        public void onCompleted() {
                                            channel.shutdown();
                                        }
                                    });
                                })
                                .flatMap(o -> studentRepository.insert(new Student(String.valueOf(((AuthInfo) o).getId()), studentCreateDTO, classes))
                                        .switchIfEmpty(Mono.error(new RuntimeException("Fail save student")))
                                )
                        )
                        .onErrorResume(e -> {
                            log.error("Error occurred: {}", e.getMessage());
                            return Mono.error(new Throwable(e));
                        })
                ).then(Mono.defer(()-> Mono.just(ResponseEntity.ok("Success"))));
    }

    @GetMapping("/search-by-id")
    public Mono<ResponseEntity<String>> searchByID(@RequestParam String id){
        log.info("### enter api.v1.student.search-by-id ###");
        log.info("# id: {} #", id);
        return studentRepository.findById(id)
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @GetMapping("/search-by-classes-id")
    public Mono<ResponseEntity<String>> searchByID(@RequestParam UUID classesID){
        log.info("### enter api.v1.student.search-by-classes-id ###");
        log.info("# id: {} #", classesID);
        return studentRepository.searchByClassesID(classesID)
                .collectList()
                .flatMap(students -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(students))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
