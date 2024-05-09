package edu.iuh.administratorservice.controller;

import edu.iuh.administratorservice.dto.DepartmentCreateDTO;
import edu.iuh.administratorservice.entity.Department;
import edu.iuh.administratorservice.repository.DepartmentRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RequestMapping("/api/v1/department")
@RestController
@Slf4j
public class DepartmentController {
    private final DepartmentRepository departmentRepository;
    private final JsonConverter jsonConverter;

    public DepartmentController(DepartmentRepository departmentRepository, JsonConverter jsonConverter) {
        this.departmentRepository = departmentRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody DepartmentCreateDTO info){
        log.info("### enter api.v1.department.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return departmentRepository.save(new Department(info))
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail save");
                    return Mono.just(ResponseEntity.status(500).body("Fail save"));
                }).then(Mono.empty()))
                .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
    }

    @PostMapping("/get-all")
    public Mono<ResponseEntity<String>> getAll(){
        log.info("### enter api.v1.department.get-all ###");
        return departmentRepository.findAll()
                .collectList()
                .flatMap(classes -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(classes))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
