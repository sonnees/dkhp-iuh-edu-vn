package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.DetailCourseCreateDTO;
import edu.iuh.administratorservice.dto.Staff2DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "detail_course")
public class DetailCourse {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    @Field(targetType = FieldType.STRING)
    private UUID courseID;
    private Staff2DTO staff;
    private int classSize;
    private int groupNumber;
    private CalenderC calender;

    public DetailCourse(DetailCourseCreateDTO dto, Course course, Staff2DTO staff) {
        this.id = UUID.randomUUID();
        this.courseID = dto.getCourseID();
        this.staff = staff;
        this.classSize = dto.getClassSize();
        this.groupNumber = dto.getGroupNumber();
        this.calender = dto.getCalender();
    }

    public DetailCourse(UUID courseID, Staff2DTO staff, int classSize, int groupNumber, CalenderC calender) {
        this.id = UUID.randomUUID();
        this.courseID = courseID;
        this.staff = staff;
        this.classSize = classSize;
        this.groupNumber = groupNumber;
        this.calender = calender;
    }
}
