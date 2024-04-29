package edu.iuh.administratorservice;

import edu.iuh.administratorservice.dto.RegistrationSearch3FieldDTO;
import edu.iuh.administratorservice.repository.RegistrationFormRepository;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import reactor.core.publisher.Mono;

import java.util.UUID;

@SpringBootApplication
@AllArgsConstructor
public class SchedulerServiceApplication {
    RegistrationFormRepository registrationFormRepository;
    public static void main(String[] args) {
        SpringApplication.run(SchedulerServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {
                registrationFormRepository.search3FieldDTO(UUID.fromString("dd2e5d9a-74c7-4232-9d56-ee253821241d"))
                        .flatMap(registrationSearch3FieldDTOS -> {
                            System.out.println(registrationSearch3FieldDTOS);
                            return Mono.empty();
                        }).then(Mono.empty())
                        .block();

            }
        };
    }

}
