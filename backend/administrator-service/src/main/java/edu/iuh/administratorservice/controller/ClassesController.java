package edu.iuh.administratorservice.controller;
import edu.iuh.administratorservice.dto.ClassesCreateDTO;
import edu.iuh.administratorservice.entity.Classes;
import edu.iuh.administratorservice.repository.ClassesRepository;
import edu.iuh.administratorservice.serialization.JsonConverter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import reactor.core.publisher.Mono;

@RequestMapping("/api/v1/classes")
@Controller
@Slf4j
public class ClassesController {
    private final ClassesRepository classesRepository;
    private final JsonConverter jsonConverter;

    public ClassesController(ClassesRepository classesRepository, JsonConverter jsonConverter) {
        this.classesRepository = classesRepository;
        this.jsonConverter = jsonConverter;
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> create(@RequestBody ClassesCreateDTO info){
        log.info("### enter api.v1.classes.create  ###");
        log.info("# info: {} #", jsonConverter.objToString(info));
        return classesRepository.save(new Classes(info))
                .switchIfEmpty(Mono.defer(()->{
                    log.error("# {} #", "Fail save");
                    return Mono.just(ResponseEntity.status(500).body("Fail save"));
                }).then(Mono.empty()))
                .flatMap(department -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(department))));
    }

    @GetMapping("/get-all")
    public Mono<ResponseEntity<String>> getAll(){
        log.info("### enter api.v1.classes.get-all ###");
        return classesRepository.findAll(Sort.by(Sort.Order.by("name")))
                .collectList()
                .flatMap(classes -> Mono.just(ResponseEntity.ok(jsonConverter.objToString(classes))))
                .onErrorResume(e -> {
                    log.error("Error occurred: {}", e.getMessage());
                    return Mono.error(new Throwable(e));
                });
    }


}
