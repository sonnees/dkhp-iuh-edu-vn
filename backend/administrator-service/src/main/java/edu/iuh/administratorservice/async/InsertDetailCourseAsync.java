package edu.iuh.administratorservice.async;

import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.dto.StaffDTO;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.entity.Staff;
import edu.iuh.administratorservice.repository.DetailCourseRepository;
import edu.iuh.administratorservice.repository.StaffRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@AllArgsConstructor
@Service
@Slf4j
public class InsertDetailCourseAsync {
    private DetailCourseRepository detailCourseRepository;
    private StaffRepository staffRepository;

    @Async
    public void insertDetailCourse(CourseCreateDTO dto, UUID courseID){
        log.info("** insertDetailCourse dto: {} courseID: {}", dto, courseID);
        // save Detail have theory
        staffRepository.findById(dto.getTheoryStaff())
                .flatMap(staff -> {
                    log.info("** staff: {}", staff);
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new StaffDTO(staff.getId(), staff.getFullName()), dto.getTheorySize(), 0, dto.getTheoryCalender()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        if(dto.getPracticalStaff()== null || dto.getPracticalStaff().isEmpty())
            return;

        // save Detail have practical 1
        staffRepository.findById(dto.getPracticalStaff().get(0))
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new StaffDTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 1, dto.getPracticalCalender1()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        // save Detail have practical 2
        staffRepository.findById(dto.getPracticalStaff().get(1))
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new StaffDTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 2, dto.getPracticalCalender2()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
        // save Detail have practical 3
        staffRepository.findById(dto.getPracticalStaff().get(2))
                .flatMap(staff -> {
                    DetailCourse detailCourse = new DetailCourse(
                            courseID, new StaffDTO(staff.getId(), staff.getFullName()), dto.getTheorySize() / 3, 3, dto.getPracticalCalender3()
                    );
                    return detailCourseRepository.save(detailCourse);
                }).subscribe();
    }
}
