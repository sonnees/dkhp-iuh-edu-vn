package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.async.InsertDetailCourseAsync;
import edu.iuh.administratorservice.dto.FileNameDTO;
import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.enums.Status;
import edu.iuh.administratorservice.repository.*;
import edu.iuh.administratorservice.serialization.ExcelFileHandle;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/v1/course")
@Controller
@Slf4j
public class CourseController {
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final RegistrationFormRepository registrationFormRepository;
    private final JsonConverter jsonConverter;
    private final ExcelFileHandle excelFileHandle;
    private final InsertDetailCourseAsync insertDetailCourseAsync;

    public CourseController(CourseRepository courseRepository, SemesterRepository semesterRepository, SubjectRepository subjectRepository, StudentRepository studentRepository, RegistrationFormRepository registrationFormRepository, JsonConverter jsonConverter, ExcelFileHandle excelFileHandle, InsertDetailCourseAsync insertDetailCourseAsync) {
        this.courseRepository = courseRepository;
        this.semesterRepository = semesterRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.registrationFormRepository = registrationFormRepository;
        this.jsonConverter = jsonConverter;
        this.excelFileHandle = excelFileHandle;
        this.insertDetailCourseAsync = insertDetailCourseAsync;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(ServerWebExchange exchange, @RequestBody FileNameDTO info) {
        log.info("### enter api.v1.course.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        List<CourseCreateDTO> infos = excelFileHandle.toCourseCreate(info.getFileName());
        return Flux.fromIterable(infos)
                .flatMap(courseCreateDTO -> semesterRepository.findById(courseCreateDTO.getSemesterId())
                        .switchIfEmpty(Mono.error(new RuntimeException("Fail find semester")))
                        .flatMap(semester -> subjectRepository.findById(courseCreateDTO.getSubjectId())
                                .switchIfEmpty(Mono.error(new RuntimeException("Fail find subject")))
                                .flatMap(subject -> courseRepository.save(new Course(semester, subject, courseCreateDTO.getTuitionFee()))
                                        .switchIfEmpty(Mono.error(new RuntimeException("Fail save course")))
                                        .map(course -> {
                                            insertDetailCourseAsync.insertDetailCourse(courseCreateDTO, course.getId(),exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION));
                                            return Mono.empty();
                                        })
                                )
                        )
                        .onErrorResume(e -> {
                            log.error("Error occurred: {}", e.getMessage());
                            return Mono.error(new Throwable(e));
                        })
                ).then(Mono.defer(()-> Mono.just(ResponseEntity.ok("Success"))));
    }

    @PostMapping("/search-by-semester-id")
    public Mono<ResponseEntity<String>> searchBySemesterID(@RequestParam UUID semesterID){
        log.info("### enter api.v1.course.search-by-semester-id ###");
        log.info("# semesterID: {} #", semesterID);
        return courseRepository.searchBySemesterID(semesterID)
                .collectList()
                .flatMap(courses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(courses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/change-status-by-semester-id")
    public Mono<ResponseEntity<String>> changeStatusBySemesterID(@RequestParam UUID semesterID, @RequestParam Status status){
        log.info("### enter api.v1.course.change-status-by-semester-id###");
        log.info("# semesterID: {} status: {} #", semesterID, status);
        return courseRepository.changeStatusBySemesterID(semesterID, status)
                .flatMap(aLong -> {
                    if(aLong<=0) {
                        log.error("# {} #", "Fail change status by semester id");
                        return Mono.just(ResponseEntity.status(500).body("Fail change status by semester id"));
                    }
                    return Mono.just(ResponseEntity.ok("Success"));
                })
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/change-status-by-id")
    public Mono<ResponseEntity<String>> changeStatusByID(@RequestParam UUID id, @RequestParam Status status){
        log.info("### enter api.v1.course.change-status-by-id###");
        log.info("# id: {} status: {} #", id, status);
        return courseRepository.findById(id)
                .flatMap(course -> courseRepository.changeStatusByID(id, status)
                        .flatMap(aLong -> registrationFormRepository.changeStatusByID(id, status))
                        .flatMap(aLong -> {
                            if(aLong<=0) {
                                log.error("# {} #", "Fail change status by semester id");
                                return Mono.error(new RuntimeException());
                            }
                            if(status.equals(Status.COURSE_CANCELLED)){
                                return studentRepository.removeSubjectBySemestersAndSubjectIDs(course.getSemester().getId(), course.getSubject().getId())
                                        .flatMap(aLong1 -> Mono.just(ResponseEntity.status(500).body("Fail change status by semester id")));
                            }
                            return Mono.just(ResponseEntity.ok("Success"));
                        })
                        .onErrorResume(e -> {
                            log.error("Error occurred: {}", e.getMessage());
                            return Mono.just(ResponseEntity.status(500).body("fail"));
                        }));
    }

}
