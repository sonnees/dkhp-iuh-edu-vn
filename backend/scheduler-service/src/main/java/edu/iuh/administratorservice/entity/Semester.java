package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.SemesterCreateDTO;
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
@Document(collection = "semester")
public class Semester {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private int year;
    private int semesterNumber;

    public Semester(SemesterCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.year = dto.getYear();
        this.semesterNumber = dto.getSemesterNumber();
    }
}
