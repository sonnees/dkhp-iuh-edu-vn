package edu.iuh.administratorservice.controller;
import edu.iuh.AuthInfo;
import edu.iuh.RegisterRequest;
import edu.iuh.RegisterServiceGrpc;
import edu.iuh.administratorservice.dto.ClassesCreateDTO;
import edu.iuh.administratorservice.dto.StaffCreateDTO;
import edu.iuh.administratorservice.entity.Classes;
import edu.iuh.administratorservice.entity.Staff;
import edu.iuh.administratorservice.repository.ClassesRepository;
import edu.iuh.administratorservice.repository.StaffRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RequestMapping("/api/v1/staff")
@RestController
@Slf4j
public class StaffController {
    private final StaffRepository staffRepository;
    private final JsonConverter jsonConverter;

    public StaffController(StaffRepository staffRepository, JsonConverter jsonConverter) {
        this.staffRepository = staffRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create-staff")
    public Mono<ResponseEntity<String>> create(@RequestBody StaffCreateDTO info){
        log.info("### enter api.v1.staff.create.staff  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        ManagedChannel channel = ManagedChannelBuilder.forTarget("localhost:9090")
                .usePlaintext()
                .build();

        RegisterServiceGrpc.RegisterServiceStub stub = RegisterServiceGrpc.newStub(channel);

        return Mono.create(sink ->{
            RegisterRequest request = RegisterRequest.newBuilder().build();
            stub.registerStaff(request, new StreamObserver<AuthInfo>() {
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
                    AuthInfo authInfo = (AuthInfo) o;
                    return staffRepository.save(new Staff(authInfo.getId(),info))
                            .switchIfEmpty(Mono.defer(()->{
                                log.error("# {} #", "Fail save staff");
                                return Mono.just(ResponseEntity.status(500).body("Fail save staff"));
                            }).then(Mono.empty()))
                            .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
                });
    }

    @PostMapping("/create-administrator")
    public Mono<ResponseEntity<String>> createAdministrator(@RequestBody StaffCreateDTO info){
        log.info("### enter api.v1.staff.create.administrator  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9090)
                .usePlaintext()
                .build();

        RegisterServiceGrpc.RegisterServiceStub stub = RegisterServiceGrpc.newStub(channel);

        return Mono.create(sink ->{
                    RegisterRequest request = RegisterRequest.newBuilder().build();
                    stub.registerAdministrator(request, new StreamObserver<AuthInfo>() {
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
                    AuthInfo authInfo = (AuthInfo) o;
                    return staffRepository.save(new Staff(authInfo.getId(),info))
                            .switchIfEmpty(Mono.defer(()->{
                                log.error("# {} #", "Fail save");
                                return Mono.just(ResponseEntity.status(500).body("Fail save admin"));
                            }).then(Mono.empty()))
                            .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
                });
    }

    @PostMapping("/get-all")
    public Mono<ResponseEntity<String>> getAll(){
        log.info("### enter api.v1.staff.get-all ###");
        return staffRepository.findAll(Sort.by(Sort.Order.by("fullName")))
                .collectList()
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/search-by-id")
    public Mono<ResponseEntity<String>> searchByID(@RequestParam String id){
        log.info("### enter api.v1.staff.search-by-id ###");
        log.info("# id: {} #", id);
        return staffRepository.findById(id)
                .flatMap(staff -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(staff))))
                .switchIfEmpty(Mono.defer(()->Mono.just(ResponseEntity.status(404).body("Not found"))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
