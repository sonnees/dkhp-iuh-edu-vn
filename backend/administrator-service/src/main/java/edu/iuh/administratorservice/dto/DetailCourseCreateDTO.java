package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.dto.StaffDTO;
import edu.iuh.administratorservice.entity.CalenderC;
import edu.iuh.administratorservice.entity.Course;
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
public class DetailCourseCreateDTO {
    private UUID courseID;
    private String staffID;
    private int classSize;
    private int groupNumber;
    private CalenderC calender;
}
