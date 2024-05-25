package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.async.InsertDetailCourseAsync;
import edu.iuh.administratorservice.dto.*;
import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.enums.Status;
import edu.iuh.administratorservice.repository.*;
import edu.iuh.administratorservice.serialization.ExcelFileHandle;
import edu.iuh.administratorservice.serialization.JsonConverter;
import edu.iuh.administratorservice.serialization.SaveFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@RequestMapping("/api/v1/course")
@RestController
@Slf4j
public class CourseController {
    private final CourseRepository courseRepository;
    private final SemesterRepository semesterRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final DetailCourseRepository detailCourseRepository;
    private final RegistrationFormRepository registrationFormRepository;
    private final JsonConverter jsonConverter;
    private final WebClient.Builder builder;
    private final ExcelFileHandle excelFileHandle;
    private final InsertDetailCourseAsync insertDetailCourseAsync;
    private final SaveFile saveFile;

    public CourseController(CourseRepository courseRepository, SemesterRepository semesterRepository, SubjectRepository subjectRepository, StudentRepository studentRepository, DetailCourseRepository detailCourseRepository, RegistrationFormRepository registrationFormRepository, JsonConverter jsonConverter, WebClient.Builder builder, ExcelFileHandle excelFileHandle, InsertDetailCourseAsync insertDetailCourseAsync, SaveFile saveFile) {
        this.courseRepository = courseRepository;
        this.semesterRepository = semesterRepository;
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
        this.detailCourseRepository = detailCourseRepository;
        this.registrationFormRepository = registrationFormRepository;
        this.jsonConverter = jsonConverter;
        this.builder = builder;
        this.excelFileHandle = excelFileHandle;
        this.insertDetailCourseAsync = insertDetailCourseAsync;
        this.saveFile = saveFile;
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
    public Mono<ResponseEntity<String>> changeStatusBySemesterID(ServerWebExchange exchange, @RequestParam UUID semesterID, @RequestParam Status status){
        log.info("### enter api.v1.course.change-status-by-semester-id###");
        log.info("# semesterID: {} status: {} #", semesterID, status);
        WebClient webClient = builder.build();
        if(!status.equals(Status.REGISTRATION_DEADLINE_PASSED))
            return courseRepository.changeStatusBySemesterID(semesterID, status)
                    .flatMap(aLong -> {
                        if(aLong<=0) {
                            log.error("# {} #", "Fail change status by semester id");
                            return courseRepository.searchBySemesterID(semesterID)
                                    .flatMap(course -> {
                                        course.setStatus(status);
                                        return registrationFormRepository.changeStatusByID(course.getId(), course);
                                    }).then(Mono.empty());
                        }
                        return Mono.just(ResponseEntity.ok("Success"));
                    })
                    .onErrorResume(e -> {
                        log.error("Error occurred: {}", e.getMessage());
                        return Mono.error(new Throwable(e));
                    });
        else {
            List<UUID> courseList = new ArrayList<>();
            List<UUID> courseCancel = new ArrayList<>();
            List<UUID> courseAccept = new ArrayList<>();
            return courseRepository.searchBySemesterID(semesterID)
                    .flatMap(course -> {
                        courseList.add(course.getId());
                        return Mono.empty();
                    })
                    .then(Mono.defer(()->{ // find course cancel
                        return Flux.fromIterable(courseList)
                                .delayElements(Duration.ofMillis(100))
                                .flatMap(uuid -> detailCourseRepository.searchByCourseID(uuid)
                                        .collectList()
                                        .flatMap(detailCourses -> {
                                            if (detailCourses.get(0).getClassSizeAvailable()==0 ){
                                                courseAccept.add(uuid);
                                                return Mono.empty();
                                            } else if (detailCourses.get(0).getClassSize()==detailCourses.get(0).getClassSizeAvailable()) {
                                                courseCancel.add(uuid);
                                                return Mono.empty();
                                            }
                                            else if (detailCourses.get(0).getClassSize() - detailCourses.get(0).getClassSizeAvailable() < Math.round((detailCourses.get(0).getClassSize() * 0.6667)))
                                                courseCancel.add(uuid);
                                            else {
                                                courseAccept.add(uuid);
                                                log.info("### {}", uuid);
                                            }
                                            return Mono.empty();
                                        })
                                        .then(Mono.empty()))
                                .then(Mono.empty());
                    }))
                    .then(Mono.defer(() -> {
                                return Flux.fromIterable(courseAccept)
                                        .flatMap(uuid -> changeStatusByID2(uuid,Status.ACCEPTANCE_TO_OPEN)
                                                .flatMap(aBoolean ->Mono.empty()))
                                        .then(Mono.defer(() -> registrationFormRepository.search3FieldDTO(semesterID)
                                                .flatMap(registrationSearch3FieldDTO -> courseRepository.findById(registrationSearch3FieldDTO.getIdCourse())
                                                        .flatMap(course -> detailCourseRepository.searchByCourseID(registrationSearch3FieldDTO.getIdCourse())
                                                                .collectList()
                                                                .flatMap(detailCourses -> {
                                                                    List<TimetableCreateDTO> timetableCreateDTOS = new ArrayList<>();


                                                                    Date date = detailCourses.get(0).getCalender().getStart();
                                                                    Calendar calendar = Calendar.getInstance();
                                                                    calendar.setTime(date);
                                                                    Date dateEnd = detailCourses.get(0).getCalender().getEnd();
                                                                    while (date.before(dateEnd)){
                                                                        TimetableCreateDTO timetableCreateDTO = new TimetableCreateDTO(registrationSearch3FieldDTO, detailCourses.get(0), course, date);
                                                                        timetableCreateDTOS.add(timetableCreateDTO);
                                                                        calendar.add(Calendar.WEEK_OF_YEAR, 1);
                                                                        date=calendar.getTime();
                                                                    }
                                                                    if(detailCourses.size()>1){
                                                                        Date date1 = detailCourses.get(registrationSearch3FieldDTO.getGroupNumber()).getCalender().getStart();
                                                                        Calendar calendar1 = Calendar.getInstance();
                                                                        calendar1.setTime(date1);
                                                                        Date dateEnd1 = detailCourses.get(registrationSearch3FieldDTO.getGroupNumber()).getCalender().getEnd();
                                                                        while (date1.before(dateEnd1)){
                                                                            TimetableCreateDTO timetableCreateDTO = new TimetableCreateDTO(registrationSearch3FieldDTO, detailCourses.get(registrationSearch3FieldDTO.getGroupNumber()), course, date1);
                                                                            timetableCreateDTOS.add(timetableCreateDTO);
                                                                            calendar1.add(Calendar.WEEK_OF_YEAR, 1);
                                                                            date1=calendar1.getTime();
                                                                        }
                                                                    }

                                                                    TimetableCreateDTO timetableCreateDTO = timetableCreateDTOS.get(0);
                                                                    return webClient.post()
                                                                            .uri("http://STUDENT-SERVICE/api/v1/timetable/creates")
                                                                            .header("Authorization", exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                                                                            .contentType(MediaType.APPLICATION_JSON)
                                                                            .bodyValue(timetableCreateDTOS)
                                                                            .retrieve()
                                                                            .bodyToMono(Void.class)
                                                                            .switchIfEmpty(Mono.defer(() -> Flux.fromIterable(Arrays.stream(timetableCreateDTO.getStudentID()).toList())
                                                                                    .flatMap(s -> {
                                                                                        AcademicResultsDTO academicResultsDTO = new AcademicResultsDTO(
                                                                                                s,semesterID,course.getSubject().getId(),course.getSubject().getName(),course.getSubject().getCreditUnits()
                                                                                        );
                                                                                        return webClient.post()
                                                                                                .uri("http://STUDENT-SERVICE/api/v1/academic-results/append")
                                                                                                .header("Authorization", exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                                                                                                .contentType(MediaType.APPLICATION_JSON)
                                                                                                .bodyValue(academicResultsDTO)
                                                                                                .retrieve()
                                                                                                .bodyToMono(Void.class);
                                                                                    })
                                                                                    .then(Mono.empty())));
                                                                })))
                                                .then(Mono.empty())));
                    }))
                    .then(Mono.defer(() -> Flux.fromIterable(courseCancel)
                            .flatMap(uuid -> changeStatusByID2(uuid,Status.COURSE_CANCELLED)).then(Mono.empty())))
                    .then(Mono.just(ResponseEntity.ok("Success")))
                    .onErrorResume(e -> {
                        log.error("Error occurred: {}", e.getMessage());
                        return Mono.error(new Throwable(e));
                    });
        }
    }

    public Mono<Boolean> changeStatusByID2(UUID id, Status status){
        return courseRepository.findById(id)
                .flatMap(course -> courseRepository.changeStatusByID(id, status)
                        .flatMap(aLong -> {
                            course.setStatus(status);
                            return registrationFormRepository.changeStatusByID(id, course);
                        })
                        .flatMap(aLong -> {
                            if(status.equals(Status.COURSE_CANCELLED)){
                                return studentRepository.removeSubjectBySemestersAndSubjectIDs(course.getSemester().getId(), course.getSubject().getId())
                                        .flatMap(aLong1 -> Mono.just(true));
                            }
                            return Mono.just(true);
                        })
                        .onErrorResume(e -> {
                            log.error("Error occurred: {}", e.getMessage());
                            return Mono.just(false);
                        }));
    }

    @PostMapping("/update-score")
    public Mono<ResponseEntity<String>> updateScoreURL(ServerWebExchange exchange, @RequestBody CourseUpdateScoreDTO info){
        log.info("### enter api.v1.course.update-score.url ###");
        log.info("# info: {} #", info);
        WebClient webClient = builder.build();
        return  courseRepository.findById(info.getCourseID())
                .flatMap(course -> {
                    log.info(jsonConverter.objToString(course));
                    List<AcademicResultsUpdateScoreDTO> score = excelFileHandle.toScore(info.getFileName(), course);
                    if (score==null) return Mono.error(new RuntimeException("Not read file"));
                    return Mono.defer(() -> Flux.fromIterable(score)
                            .collectList()
                            .flatMap(list -> webClient.post()
                                    .uri("http://STUDENT-SERVICE/api/v1/academic-results/update-score")
                                    .header("Authorization", exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION))
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .bodyValue(list)
                                    .retrieve()
                                    .bodyToMono(Void.class)).then(Mono.just(ResponseEntity.ok("Success")))
                            .onErrorResume(e -> {
                                log.error("Error occurred: {}", e.getMessage());
                                return Mono.error(new RuntimeException(e.getMessage()));
                            }));
                })
                .switchIfEmpty(Mono.error(new RuntimeException("Error in courseID")));

    }



}
