package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.dto.DepartmentCreateDTO;
import edu.iuh.administratorservice.dto.MajorsCreateDTO;
import edu.iuh.administratorservice.entity.Department;
import edu.iuh.administratorservice.entity.Majors;
import edu.iuh.administratorservice.repository.MajorsRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RequestMapping("/api/v1/majors")
@RestController
@Slf4j
public class MajorsController {
    private final MajorsRepository majorsRepository;
    private final JsonConverter jsonConverter;

    public MajorsController(MajorsRepository majorsRepository, JsonConverter jsonConverter) {
        this.majorsRepository = majorsRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody MajorsCreateDTO info){
        log.info("### enter api.v1.majors.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return majorsRepository.save(new Majors(info))
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail save");
                    return Mono.just(ResponseEntity.status(500).body("Fail save"));
                }).then(Mono.empty()))
                .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
    }

    @PostMapping("/search-by-department-id")
    public Mono<ResponseEntity<String>> searchBySemesterID(@RequestParam UUID departmentID){
        log.info("### enter api.v1.detail_course.search-by-department-id ###");
        log.info("# departmentID: {} #", departmentID);
        return majorsRepository.searchByDepartmentID(departmentID)
                .collectList()
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
