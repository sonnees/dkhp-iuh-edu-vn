package edu.iuh.administratorservice.controller;

import edu.iuh.administratorservice.dto.DetailCourseCreateDTO;
import edu.iuh.administratorservice.dto.Staff2DTO;
import edu.iuh.administratorservice.dto.StaffDTO;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.repository.CourseRepository;
import edu.iuh.administratorservice.repository.DetailCourseRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RequestMapping("/api/v1/detail_course")
@Controller
@Slf4j
public class DetailCourseController {
    private final DetailCourseRepository detailCourseRepository;
    private final CourseRepository courseRepository;
    private final WebClient.Builder builder;
    private final JsonConverter jsonConverter;

    public DetailCourseController(DetailCourseRepository detailCourseRepository, CourseRepository courseRepository, WebClient.Builder builder, JsonConverter jsonConverter) {
        this.detailCourseRepository = detailCourseRepository;
        this.courseRepository = courseRepository;
        this.builder = builder;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(ServerWebExchange exchange , @RequestBody DetailCourseCreateDTO info){
        log.info("### enter api.v1.detail_course.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        WebClient webClient = builder.build();
        String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        return courseRepository.findById(info.getCourseID())
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail find course");
                    return Mono.just(ResponseEntity.status(500).body("Fail find course"));
                }).then(Mono.empty()))
                .flatMap(course -> webClient.post()
                        .uri("http://ADMINISTRATOR-SERVICE/api/v1/staff/search-by-id?id="+info.getStaffID())
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .retrieve()
                        .bodyToMono(StaffDTO.class)
                        .switchIfEmpty(Mono.defer(()->{
                            log.error("# {} #", "Fail find staff");
                            return Mono.just(ResponseEntity.status(500).body("Fail find staff"));
                        }).then(Mono.empty()))
                        .flatMap(staff -> detailCourseRepository.save(new DetailCourse(info, course, new Staff2DTO(staff.getId(),staff.getFullName())))
                                .switchIfEmpty(Mono.defer(()->{
                                    log.error("# {} #", "Fail save detail course");
                                    return Mono.just(ResponseEntity.status(500).body("Fail save detail course"));
                                }).then(Mono.empty()))
                                .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))))));

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
