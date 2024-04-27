package edu.iuh.administratorservice.async;

import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.dto.Staff2DTO;
import edu.iuh.administratorservice.dto.StaffDTO;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.repository.DetailCourseRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.UUID;

@AllArgsConstructor
@Service
@Slf4j
public class InsertDetailCourseAsync {
    private DetailCourseRepository detailCourseRepository;
    private final WebClient.Builder builder;
    @Async
    public void insertDetailCourse(CourseCreateDTO dto, UUID courseID, String token){
        WebClient webClient = builder.build();
        log.info("** insertDetailCourse dto: {} courseID: {}", dto, courseID);
        // save Detail have theory
        webClient.post()
                .uri("http://ADMINISTRATOR-SERVICE/api/v1/staff/search-by-id?id="+dto.getTheoryStaff())
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(StaffDTO.class)
                .flatMap(staff -> {
                    log.info("** staff: {}", staff);
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new Staff2DTO(staff.getId(), staff.getFullName()), dto.getTheorySize(), 0, dto.getTheoryCalender()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        if(dto.getPracticalStaff()== null || dto.getPracticalStaff().isEmpty())
            return;

        // save Detail have practical 1
        webClient.post()
                .uri("http://ADMINISTRATOR-SERVICE/api/v1/staff/search-by-id?id="+dto.getPracticalStaff().get(0))
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(StaffDTO.class)
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new Staff2DTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 1, dto.getPracticalCalender1()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        // save Detail have practical 2
        webClient.post()
                .uri("http://ADMINISTRATOR-SERVICE/api/v1/staff/search-by-id?id="+dto.getPracticalStaff().get(1))
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(StaffDTO.class)
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new Staff2DTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 2, dto.getPracticalCalender2()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        // save Detail have practical 3
        webClient.post()
                .uri("http://ADMINISTRATOR-SERVICE/api/v1/staff/search-by-id?id="+dto.getPracticalStaff().get(2))
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(StaffDTO.class)
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new Staff2DTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 3, dto.getPracticalCalender3()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
    }
}
