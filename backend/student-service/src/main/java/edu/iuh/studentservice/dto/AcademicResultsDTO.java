package edu.iuh.studentservice.dto;

import edu.iuh.studentservice.entity.Semester;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AcademicResultsDTO {
    private String id;
    @Field(targetType = FieldType.STRING)
    private UUID semesterID;
    @Field(targetType = FieldType.STRING)
    private UUID subjectID;
    private String subjectName;
    private int creditUnits;
}

