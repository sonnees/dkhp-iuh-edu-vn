package edu.iuh.authenticationservice;

import edu.iuh.authenticationservice.entity.StudentAuth;
import edu.iuh.authenticationservice.entity.UserRole;
import lombok.AllArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@AllArgsConstructor
@SpringBootApplication
public class AuthenticationServiceApplication {
	private StudentAuthRepository repository;
	private PasswordEncoder passwordEncoder;
	public static void main(String[] args) {
		SpringApplication.run(AuthenticationServiceApplication.class, args);
	}

//	@Bean
	CommandLineRunner commandLineRunner(){
		return new CommandLineRunner() {
			@Override
			public void run(String... args) throws Exception {
				StudentAuth save = repository.save(new StudentAuth(
						passwordEncoder.encode("123"),
						UserRole.STUDENT
				));
				System.out.println(save);
			}
		};
	}
}
