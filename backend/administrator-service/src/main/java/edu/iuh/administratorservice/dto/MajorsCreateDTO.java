package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MajorsCreateDTO {
    private String name;
    private UUID departmentID;
    private UUID[] electiveSubjects;
    private UUID[] requiredCourses;
}
