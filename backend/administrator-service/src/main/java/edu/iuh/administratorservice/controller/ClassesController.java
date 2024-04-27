package edu.iuh.administratorservice.controller;
import edu.iuh.AuthInfo;
import edu.iuh.RegisterRequest;
import edu.iuh.RegisterServiceGrpc;
import edu.iuh.administratorservice.dto.ClassesCreateDTO;
import edu.iuh.administratorservice.dto.FileNameDTO;
import edu.iuh.administratorservice.dto.StudentCreateDTO;
import edu.iuh.administratorservice.entity.Classes;
import edu.iuh.administratorservice.repository.ClassesRepository;
import edu.iuh.administratorservice.serialization.ExcelFileHandle;
import edu.iuh.administratorservice.serialization.JsonConverter;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RequestMapping("/api/v1/classes")
@Controller
@Slf4j
public class ClassesController {
    private final ClassesRepository classesRepository;
    private final JsonConverter jsonConverter;
    private final ExcelFileHandle excelFileHandle;
    private final WebClient.Builder builder;

    public ClassesController(ClassesRepository classesRepository, JsonConverter jsonConverter, ExcelFileHandle excelFileHandle, WebClient.Builder builder) {
        this.classesRepository = classesRepository;
        this.jsonConverter = jsonConverter;
        this.excelFileHandle = excelFileHandle;
        this.builder = builder;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody ClassesCreateDTO info){
        log.info("### enter api.v1.classes.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return classesRepository.save(new Classes(info))
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail save");
                    return Mono.just(ResponseEntity.status(500).body("Fail save"));
                }).then(Mono.empty()))
                .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
    }

    @GetMapping("/get-all")
    public Mono<ResponseEntity<String>> getAll(){
        log.info("### enter api.v1.classes.get-all ###");
        return classesRepository.findAll(Sort.by(Sort.Order.by("name")))
                .collectList()
                .flatMap(classes -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(classes))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/create-students")
    public Mono<ResponseEntity<String>> create(ServerWebExchange exchange, @RequestBody FileNameDTO info){
        log.info("### enter api.v1.classes.create-students  ###");
        log.info("# info: {} #", info);

        WebClient webClient = builder.build();
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
                                        .flatMap(o -> {
                                            studentCreateDTO.setId(String.valueOf(((AuthInfo) o).getId()));
                                            return Mono.empty();
                                        })
                        )
                        .onErrorResume(e -> {
                            log.error("Error occurred: {}", e.getMessage());
                            return Mono.error(new Throwable(e));
                        })
                ).then(Mono.defer(()-> webClient.post()
                        .uri("http://STUDENT-SERVICE/api/v1/student/creates")
                        .header("Authorization", exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(studentCreates)
                        .retrieve()
                        .bodyToMono(Void.class)
                        .then(Mono.just(ResponseEntity.ok("Success")))));
    }


}
