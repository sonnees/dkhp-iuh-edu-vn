package edu.iuh.studentservice.entity;

import edu.iuh.studentservice.dto.AcademicResultsDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Semester {
    @Field(targetType = FieldType.STRING)
    private UUID id;
    private List<Subject> subjects;

    public Semester(AcademicResultsDTO dto) {
        this.id = dto.getSemesterID();
        this.subjects = new ArrayList<>();
        this.subjects.add(new Subject(dto));
    }
}
