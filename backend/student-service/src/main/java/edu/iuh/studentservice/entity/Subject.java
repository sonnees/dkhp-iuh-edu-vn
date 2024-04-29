package edu.iuh.studentservice.entity;

import edu.iuh.studentservice.dto.AcademicResultsDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Subject {
    @Field(targetType = FieldType.STRING)
    private UUID id;
    private String subjectName;
    private int creditUnits;
    private float[] theoryScore;
    private float[] practicalScore;
    private float midtermScore;
    private float finalScore;

    public Subject(AcademicResultsDTO dto) {
        this.id = dto.getSubjectID();
        this.subjectName = dto.getSubjectName();
        this.creditUnits = dto.getCreditUnits();
    }
}
