package edu.iuh.studentservice.controller;

import edu.iuh.studentservice.dto.AcademicResultsDTO;
import edu.iuh.studentservice.entity.AcademicResults;
import edu.iuh.studentservice.entity.Semester;
import edu.iuh.studentservice.entity.Student;
import edu.iuh.studentservice.entity.Subject;
import edu.iuh.studentservice.repository.AcademicResultsRepository;
import edu.iuh.studentservice.repository.StudentRepository;
import edu.iuh.studentservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/academic-results")
@Controller
@Slf4j
public class AcademicResultsController {
    private final AcademicResultsRepository academicResultsRepository;
    private final JsonConverter jsonConverter;

    public AcademicResultsController(AcademicResultsRepository academicResultsRepository, JsonConverter jsonConverter) {
        this.academicResultsRepository = academicResultsRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/append")
    public Mono<ResponseEntity<String>> create(@RequestBody AcademicResultsDTO info){
        log.info("### enter api.v1.academic-results.append  ###");
        log.info("# info: {} #", info);
        return academicResultsRepository.findBySemesterID(info.getId(),info.getSemesterID())
                .flatMap(academicResults -> {
                    return academicResultsRepository.findBySemesterIDAndSubjectID(info.getId(),info.getSemesterID(), info.getSubjectID())
                            .flatMap(academicResults1 -> {
                                return Mono.just(ResponseEntity.ok("Success"));
                            })
                            .switchIfEmpty(Mono.defer(() -> {
                                return academicResultsRepository.appendSubject(info.getId(),info.getSemesterID(),new Subject(info))
                                        .flatMap(aLong -> {
                                            return Mono.just(ResponseEntity.ok("Success"));
                                        });
                            }));
                })
                .switchIfEmpty(Mono.defer(() -> {
                    return academicResultsRepository.appendSubjectNotExistSemesterID(info.getId(),new Semester(info))
                            .flatMap(aLong -> {
                                return Mono.just(ResponseEntity.ok("Success"));
                            });
                }))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/search")
    public Mono<ResponseEntity<String>> create(@RequestParam String info){
        log.info("### enter api.v1.academic-results.search  ###");
        log.info("# info: {} #", info);
        return academicResultsRepository.findById(info)
                .flatMap(academicResults -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(academicResults))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }


}
