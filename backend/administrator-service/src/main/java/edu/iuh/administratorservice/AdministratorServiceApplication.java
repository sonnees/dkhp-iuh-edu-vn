package edu.iuh.administratorservice;

import com.netflix.discovery.converters.Auto;
import edu.iuh.administratorservice.repository.CourseRepository;
import edu.iuh.administratorservice.repository.DetailCourseRepository;
import edu.iuh.administratorservice.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AdministratorServiceApplication {
    private DetailCourseRepository detailCourseRepository;
    private CourseRepository courseRepository;
    private StaffRepository staffRepository;


    public static void main(String[] args) {
        SpringApplication.run(AdministratorServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(){
        return new CommandLineRunner() {
            @Override
            public void run(String... args) throws Exception {

            }
        };
    }

}
