package edu.iuh.studentservice.controller;
import edu.iuh.studentservice.entity.AcademicResults;
import edu.iuh.studentservice.entity.Student;
import edu.iuh.studentservice.repository.AcademicResultsRepository;
import edu.iuh.studentservice.repository.StudentRepository;
import edu.iuh.studentservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/student")
@RestController
@Slf4j
public class StudentController {
    private final StudentRepository studentRepository;
    private final AcademicResultsRepository academicResultsRepository;
    private final JsonConverter jsonConverter;

    public StudentController(StudentRepository studentRepository, AcademicResultsRepository academicResultsRepository, JsonConverter jsonConverter) {
        this.studentRepository = studentRepository;
        this.academicResultsRepository = academicResultsRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/creates")
    public Mono<ResponseEntity<String>> create(@RequestBody List<Student> info){
        log.info("### enter api.v1.student.create  ###");
        log.info("# info: {} #", info);
        return studentRepository.saveAll(info)
                .flatMap(students -> academicResultsRepository.save(new AcademicResults(students.getId()))
                        .flatMap(academicResults -> Mono.empty()))
                .then(Mono.just(ResponseEntity.ok("Success")))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/search-by-id")
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

    @PostMapping("/search-by-classes-id")
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
