package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.dto.SemesterCreateDTO;
import edu.iuh.administratorservice.entity.Semester;
import edu.iuh.administratorservice.repository.SemesterRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RequestMapping("/api/v1/semester")
@Controller
@Slf4j
public class SemesterController {
    private final SemesterRepository semesterRepository;
    private final JsonConverter jsonConverter;

    public SemesterController(SemesterRepository semesterRepository, JsonConverter jsonConverter) {
        this.semesterRepository = semesterRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody SemesterCreateDTO info){
        log.info("### enter api.v1.semester.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return semesterRepository.save(new Semester(info))
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail save");
                    return Mono.just(ResponseEntity.status(500).body("Fail save"));
                }).then(Mono.empty()))
                .flatMap(department -> {
                    return Mono.just(ResponseEntity.ok(jsonConverter.objToString(department)));
                });
    }

    @GetMapping("/search-by-year")
    public Mono<ResponseEntity<String>> searchByYear(@RequestParam int year){
        log.info("### enter api.v1.detail_course.search-by-year ###");
        log.info("# year: {} #", year);
        return semesterRepository.searchByYear(year)
                .collectList()
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
