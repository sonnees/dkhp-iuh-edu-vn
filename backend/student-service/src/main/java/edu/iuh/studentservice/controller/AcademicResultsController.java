package edu.iuh.studentservice.controller;

import edu.iuh.studentservice.dto.AcademicResultsDTO;
import edu.iuh.studentservice.dto.AcademicResultsUpdateScoreDTO;
import edu.iuh.studentservice.entity.Semester;
import edu.iuh.studentservice.entity.Subject;
import edu.iuh.studentservice.repository.AcademicResultsRepository;
import edu.iuh.studentservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@RequestMapping("/api/v1/academic-results")
@RestController
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
        return
                academicResultsRepository.findBySemesterID(info.getId(),info.getSemesterID())
                .flatMap(academicResults -> {
                    log.info("1");
                    return academicResultsRepository.findBySemesterIDAndSubjectID(info.getId(),info.getSemesterID(), info.getSubjectID())
                            .flatMap(academicResults1 -> {
                                log.info("1.1");
                                return Mono.just(ResponseEntity.ok("Success"));
                            })
                            .switchIfEmpty(Mono.defer(() -> {
                                return academicResultsRepository.appendSubject(info.getId(),info.getSemesterID(),new Subject(info))
                                        .flatMap(aLong -> {
                                            log.info("1.2");
                                            return Mono.just(ResponseEntity.ok("Success"));
                                        });
                            }));
                })
                .switchIfEmpty(Mono.defer(() -> {
                    return academicResultsRepository.appendSubjectNotExistSemesterID(info.getId(),new Semester(info))
                            .flatMap(aLong -> {
                                log.info("2");
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

    @PostMapping("/update-score")
    public Mono<ResponseEntity<String>> create(@RequestBody List<AcademicResultsUpdateScoreDTO> infos){
        log.info("### enter api.v1.academic-results.update-score  ###");
        log.info("# infos: {} #", infos);
        return Flux.fromIterable(infos)
                .flatMap(dto -> academicResultsRepository.findBySemesterIDAndSubjectID(dto.getId(),dto.getSemesterID(),dto.getSubjectID())
                        .flatMap(academicResults -> {
                            AtomicReference<List<Subject>> list = new AtomicReference<>(new ArrayList<>());
                            academicResults.getSemesters().forEach(semester -> {
                                if (semester.getId().equals(dto.getSemesterID())){
                                    List<Subject> subjects = semester.getSubjects();
                                    subjects.forEach(subject -> {
                                        if(subject.getId().equals(dto.getSubjectID())){
                                            subject.setTheoryScore(dto.getTheoryScore());
                                            subject.setPracticalScore(dto.getPracticalScore());
                                            subject.setMidtermScore(dto.getMidtermScore());
                                            subject.setFinalScore(dto.getFinalScore());
                                            list.set(subjects);
                                        }
                                    });
                                }
                            });
                            return academicResultsRepository.updateScore(dto.getId(), dto.getSemesterID(), dto.getSubjectID(), list.get())
                                    .flatMap(aLong -> Mono.empty());
                        })).then(Mono.just(ResponseEntity.ok("Success")))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }


}
