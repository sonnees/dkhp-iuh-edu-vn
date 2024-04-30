package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegistrationFormDTO {
    private String studentID;
    private UUID[] detailCourseIDs; // group f
    private int groupNumber;
}
