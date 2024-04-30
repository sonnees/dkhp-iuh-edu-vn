package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AcademicResultsUpdateScoreDTO {
    private String id;
    @Field(targetType = FieldType.STRING)
    private UUID semesterID;
    @Field(targetType = FieldType.STRING)
    private UUID subjectID;
    private double[] theoryScore;
    private double[] practicalScore;
    private double midtermScore;
    private double finalScore;
}

