package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.dto.ClassesCreateDTO;
import edu.iuh.administratorservice.dto.DetailCourseCreateDTO;
import edu.iuh.administratorservice.dto.StaffDTO;
import edu.iuh.administratorservice.entity.Classes;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.repository.ClassesRepository;
import edu.iuh.administratorservice.repository.CourseRepository;
import edu.iuh.administratorservice.repository.DetailCourseRepository;
import edu.iuh.administratorservice.repository.StaffRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RequestMapping("/api/v1/detail_course")
@Controller
@Slf4j
public class DetailCourseController {
    private final DetailCourseRepository detailCourseRepository;
    private final CourseRepository courseRepository;
    private final StaffRepository staffRepository;
    private final JsonConverter jsonConverter;

    public DetailCourseController(DetailCourseRepository detailCourseRepository, CourseRepository courseRepository, StaffRepository staffRepository, JsonConverter jsonConverter) {
        this.detailCourseRepository = detailCourseRepository;
        this.courseRepository = courseRepository;
        this.staffRepository = staffRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody DetailCourseCreateDTO info){
        log.info("### enter api.v1.detail_course.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return courseRepository.findById(info.getCourseID())
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail find course");
                    return Mono.just(ResponseEntity.status(500).body("Fail find course"));
                }).then(Mono.empty()))
                .flatMap(course -> {
                    return staffRepository.findById(info.getStaffID())
                            .switchIfEmpty(Mono.defer(()->{
                                log.error("# {} #", "Fail find staff");
                                return Mono.just(ResponseEntity.status(500).body("Fail find staff"));
                            }).then(Mono.empty()))
                            .flatMap(staff -> {
                                return detailCourseRepository.save(new DetailCourse(info, course, new StaffDTO(staff.getId(),staff.getFullName())))
                                        .switchIfEmpty(Mono.defer(()->{
                                            log.error("# {} #", "Fail save detail course");
                                            return Mono.just(ResponseEntity.status(500).body("Fail save detail course"));
                                        }).then(Mono.empty()))
                                        .flatMap(department -> {
                                            return Mono.just(ResponseEntity.ok(jsonConverter.objToString(department)));
                                        });
                            });
                });

    }

    @GetMapping("/search-by-course-id")
    public Mono<ResponseEntity<String>> searchBySemesterID(@RequestParam UUID courseID){
        log.info("### enter api.v1.detail_course.search-by-course-id ###");
        log.info("# courseID: {} #", courseID);
        return detailCourseRepository.searchByCourseID(courseID)
                .collectList()
                .flatMap(detailCourses -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(detailCourses))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
