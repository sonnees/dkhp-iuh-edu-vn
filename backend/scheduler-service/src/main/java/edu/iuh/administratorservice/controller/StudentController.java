package edu.iuh.administratorservice.controller;

import edu.iuh.administratorservice.dto.StudentCreateDTO;
import edu.iuh.administratorservice.dto.RegistrationFormRemoveDTO;
import edu.iuh.administratorservice.entity.Student;
import edu.iuh.administratorservice.repository.StudentRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RequestMapping("/api/v1/student-2")
@Controller
@Slf4j
public class StudentController {
    private final StudentRepository studentRepository;
    private final JsonConverter jsonConverter;

    public StudentController(StudentRepository studentRepository, JsonConverter jsonConverter) {
        this.studentRepository = studentRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/creates")
    public Mono<ResponseEntity<String>> create(@RequestBody List<StudentCreateDTO> info){
        log.info("### enter api.v1.student.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return Flux.fromIterable(info)
                .flatMap(studentCreateDTOS -> studentRepository.save(new Student(studentCreateDTOS))
                        .switchIfEmpty(Mono.defer(()->{
                            log.error("# {} #", "Fail save");
                            return Mono.just(ResponseEntity.status(500).body("Fail save"));
                        }).then(Mono.empty())))
                .then(Mono.just(ResponseEntity.ok("Success")));


    }

    @PostMapping("/search-by-student-id")
    public Mono<ResponseEntity<String>> searchByID(@RequestParam String studentID){
        log.info("### enter api.v1.subject.search-by-student-id ###");
        log.info("# studentID {} #", studentID);
        return studentRepository.findById(studentID)
                .flatMap(subject -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(subject))))
                .switchIfEmpty(Mono.defer(()->Mono.just(ResponseEntity.status(404).body("Not found"))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }
}
