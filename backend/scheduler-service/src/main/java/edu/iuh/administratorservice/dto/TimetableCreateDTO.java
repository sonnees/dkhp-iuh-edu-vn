package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.enums.ClassHour;
import edu.iuh.administratorservice.enums.ClassRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TimetableCreateDTO {
    private String[] studentID;
    private String subjectName;
    private UUID courseID;
    private ClassHour classHour;
    private ClassRoom classRoom;
    private Date date;
    private String staffName;

    public TimetableCreateDTO(RegistrationSearch3FieldDTO search3FieldDTO, DetailCourse detailCourse, Course course, Date date) {
        this.studentID = search3FieldDTO.getStudentID();
        this.subjectName = course.getSubject().getName();
        this.courseID = course.getId();
        this.classHour = detailCourse.getCalender().getClassHour();
        this.classRoom = detailCourse.getCalender().getClassRoom();
        this.date = date;
        this.staffName = detailCourse.getStaff().getFullName();
    }
}
