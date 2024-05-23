package edu.iuh.administratorservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RequestMapping("/api/v1/check-administrator")
@RestController
@Slf4j
public class CheckController {
    @PostMapping
    public Mono<ResponseEntity<String>> checkAuth(){
        log.info("### enter api.v1.check-administrator ###");
        return Mono.just(ResponseEntity.ok(""));
    }
}
