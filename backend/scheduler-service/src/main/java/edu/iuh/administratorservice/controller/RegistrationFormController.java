package edu.iuh.administratorservice.controller;

import edu.iuh.RegisterFormRequest;
import edu.iuh.RegisterFormResponse;
import edu.iuh.SendEmailServiceGrpc;
import edu.iuh.administratorservice.dto.RegistrationFormDTO;
import edu.iuh.administratorservice.dto.RegistrationFormRemoveDTO;
import edu.iuh.administratorservice.dto.RegistrationGenFileUpdateScoreDTO;
import edu.iuh.administratorservice.dto.StudentAppendSubjectDTO;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.entity.RegistrationForm;
import edu.iuh.administratorservice.entity.Semester2;
import edu.iuh.administratorservice.entity.Subject2;
import edu.iuh.administratorservice.repository.*;
import edu.iuh.administratorservice.serialization.ExcelFileHandle;
import edu.iuh.administratorservice.serialization.JsonConverter;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/registration-form")
@RestController
@Slf4j
public class RegistrationFormController {
    private final RegistrationFormRepository registrationFormRepository;
    private final DetailCourseRepository detailCourseRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final WebClient.Builder builder;
    private final JsonConverter jsonConverter;
    private final ExcelFileHandle excelFileHandle;


    public RegistrationFormController(RegistrationFormRepository registrationFormRepository, DetailCourseRepository detailCourseRepository, StudentRepository studentRepository, CourseRepository courseRepository, WebClient.Builder builder, JsonConverter jsonConverter, ExcelFileHandle excelFileHandle) {
        this.registrationFormRepository = registrationFormRepository;
        this.detailCourseRepository = detailCourseRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.builder = builder;
        this.jsonConverter = jsonConverter;
        this.excelFileHandle = excelFileHandle;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(ServerWebExchange exchange, @RequestBody RegistrationFormDTO info) {
        log.info("### enter api.v1.registration-form.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        List<UUID> detailCourseIDs = Arrays.stream(info.getDetailCourseIDs()).toList();
        return Flux.fromIterable(detailCourseIDs)
                .flatMap(uuid -> detailCourseRepository.decreaseClassSizeAvailable(uuid)
                        .flatMap(Mono::just)
                )
                .collectList()
                .flatMap(list -> {
                    if(detailCourseIDs.size()==1){
                        if(list.get(0)<=0) return Mono.error(new RuntimeException("decrease"));
                    }
                    else{
                        if(list.get(0)<=0 && list.get(1)<=0) return Mono.error(new RuntimeException("decrease"));

                        if(list.get(0)<=0 && list.get(1)>0){
                            return detailCourseRepository.increaseClassSizeAvailable(info.getDetailCourseIDs()[1])
                                    .flatMap(aLong -> Mono.error(new RuntimeException("decrease")));
                        }

                        if(list.get(0)>0 && list.get(1)<=0){
                            return detailCourseRepository.increaseClassSizeAvailable(info.getDetailCourseIDs()[0])
                                    .flatMap(aLong -> Mono.error(new RuntimeException("decrease")));
                        }
                    }

                    ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9092)
                            .usePlaintext()
                            .build();
                    SendEmailServiceGrpc.SendEmailServiceStub stub = SendEmailServiceGrpc.newStub(channel);

                    return detailCourseRepository.findById(detailCourseIDs.get(0))
                            .flatMap(detailCourse -> courseRepository.findById(detailCourse.getCourseID())
                                    .flatMap(course -> registrationFormRepository.save(new RegistrationForm(info.getStudentID(), course, info.getGroupNumber()))
                                            .flatMap(registrationForm -> Mono.create(sink ->{
                                                log.info("**** {}", 1);
                                                RegisterFormRequest request = RegisterFormRequest.newBuilder()
                                                        .setStudentID(info.getStudentID())
                                                        .setSubjectName(course.getSubject().getName())
                                                        .setRegisterFormID(registrationForm.getId().toString())
                                                        .setTuitionFee(course.getTuitionFee())
                                                        .setGmail(info.getGmail())
                                                        .build();
                                                log.info("**** {}", request);
                                                stub.registerFormSuccess(request, new StreamObserver<RegisterFormResponse>() {
                                                    @Override
                                                    public void onNext(RegisterFormResponse value) {
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
                                            }).then(Mono.just(registrationForm)))
                                            .switchIfEmpty(Mono.error(new RuntimeException("fail"))))
                            );

                })
                .flatMap(registrationForm -> {
                    log.info("13");
                    StudentAppendSubjectDTO dto = new StudentAppendSubjectDTO(info.getStudentID(), registrationForm.getCourse().getSemester().getId(), new Subject2(registrationForm));
                    return studentRepository.findBySemesterID(dto.getId(), dto.getSemesterID())
                            .flatMap(student -> studentRepository.appendSubject(dto.getId(),dto.getSemesterID(),dto.getSubject())
                                    .flatMap(aLong -> {
                                        if(aLong<=0) return Mono.defer(()->Mono.just(ResponseEntity.status(500).body("Fail")));
                                        return Mono.just(ResponseEntity.ok("Success"));
                                    }))
                            .switchIfEmpty(Mono.defer(()->{
                                List<Subject2> subject2List = new ArrayList<>();
                                subject2List.add(dto.getSubject());
                                Semester2 semester2 = new Semester2(dto.getSemesterID(), subject2List);
                                return studentRepository.appendSubjectNotExistSemesterID(dto.getId(), semester2);
                            }).then(Mono.just(ResponseEntity.ok("Success"))));
                })
                .onErrorResume(e -> {
                    if(e.getMessage().equals("decrease"))
                        return Mono.just(ResponseEntity.status(409).body("Not available"));
                    if(e.getMessage().equals("fail")){
                        return Flux.fromIterable(detailCourseIDs)
                                .flatMap(detailCourseRepository::increaseClassSizeAvailable)
                                .then(Mono.just(ResponseEntity.status(500).body("Fail append student")));
                    }
                    return Mono.just(ResponseEntity.status(404).body("Not found"));
                });
    }

    @PostMapping("/delete")
    public Mono<ResponseEntity<String>> delete(ServerWebExchange exchange, @RequestBody RegistrationFormRemoveDTO info) {
        log.info("### enter api.v1.registration-form.delete  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return studentRepository.removeSubject(info.getId(), info.getSemesterID(), info.getSubjectID())
                .flatMap(aLong -> {
                    if(aLong<=0) return Mono.defer(()->Mono.just(ResponseEntity.status(500).body("Fail")));
                    return registrationFormRepository.findById(info.getRegistrationFormID())
                            .flatMap(registrationForm -> detailCourseRepository.searchByCourseID(registrationForm.getCourse().getId())
                                    .collectList()
                                    .flatMap(detailCourses -> {
                                        log.info("** {}", jsonConverter.objToString(detailCourses));
                                        List<UUID> uuids = new ArrayList<>();
                                        uuids.add(detailCourses.get(0).getId());
                                        if(detailCourses.size()==2){
                                            uuids.add(detailCourses.get(registrationForm.getGroupNumber()).getId());
                                        }
                                        log.info("** {}", jsonConverter.objToString(uuids));
                                        return Flux.fromIterable(uuids)
                                                .flatMap(detailCourseRepository::increaseClassSizeAvailable)
                                                .flatMap(aLong1 -> {
                                                    return registrationFormRepository.deleteById(registrationForm.getId());
                                                })
                                                .then(Mono.empty());
                                    }));
                })
                .then(Mono.just(ResponseEntity.ok("Success")))
                .onErrorResume(e -> {
                    log.error("# {} #", e.getMessage());
                    return Mono.just(ResponseEntity.status(404).body("Not found"));
                });
    }

    @PostMapping("/search-by-courseID")
    public Mono<ResponseEntity<String>> searchByCourseID(@RequestParam UUID id){
        log.info("### enter api.v1.detail_course.search-by-courseID ###");
        log.info("# id: {} #", id);
        return registrationFormRepository.searchByCourseID(id)
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/gen-file-update-score")
    public Mono<ResponseEntity<String>> genFileUpdateScore(@RequestBody RegistrationGenFileUpdateScoreDTO info){
        log.info("### enter api.v1.detail_course.gen-file-update-score ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return registrationFormRepository.searchByCourseID(info.getCourseID())
                .flatMap(registrationSearchByCourseIDDTO -> {
                    excelFileHandle.writeToExcel(registrationSearchByCourseIDDTO, info.getFileName(), info.getCourseID().toString());
                    return Mono.just(ResponseEntity.ok(jsonConverter.objToString(info.getFileName())));
                })
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/search")
    public Mono<ResponseEntity<String>> search(@RequestParam UUID id){
        log.info("### enter api.v1.search ###");
        log.info("# id: {} #", id);
        return registrationFormRepository.findById(id)
                .flatMap(registrationForm -> {
                    return Mono.just(ResponseEntity.ok(jsonConverter.objToString(registrationForm)));
                })
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }



}
