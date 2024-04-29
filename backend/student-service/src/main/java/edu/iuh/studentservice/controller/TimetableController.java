package edu.iuh.studentservice.controller;

import edu.iuh.studentservice.dto.TimetableCreateDTO;
import edu.iuh.studentservice.dto.TimetableSearchByStudentIDDTO;
import edu.iuh.studentservice.entity.Timetable;
import edu.iuh.studentservice.repository.TimetableRepository;
import edu.iuh.studentservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@RequestMapping("/api/v1/timetable")
@Controller
@Slf4j
public class TimetableController {
    private final JsonConverter jsonConverter;
    private final TimetableRepository timetableRepository;

    public TimetableController(JsonConverter jsonConverter, TimetableRepository timetableRepository) {
        this.jsonConverter = jsonConverter;
        this.timetableRepository = timetableRepository;
    }

    @PostMapping("/creates")
    public Mono<ResponseEntity<String>> create(@RequestBody List<TimetableCreateDTO> info){
        log.info("### enter api.v1.timetable  ###");
        log.info("# info: {} #", info);
        List<Timetable> timetables = new ArrayList<>();
        info.forEach(timetableCreateDTO ->timetables.add(new Timetable(timetableCreateDTO)) );

        return timetableRepository.saveAll(timetables)
                .collectList()
                .flatMap(timetables1 -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(timetables1))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

    @PostMapping("/search-by-student-id")
    public Mono<ResponseEntity<String>> create(@RequestBody TimetableSearchByStudentIDDTO info){
        log.info("### enter api.v1.timetable.search-by-student-id ###");
        log.info("# info: {} #", info);

        return timetableRepository.searchByClassesID(info.getStudentID(),info.getStart(),info.getEnd())
                .collectList()
                .flatMap(timetables -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(timetables))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }

}
