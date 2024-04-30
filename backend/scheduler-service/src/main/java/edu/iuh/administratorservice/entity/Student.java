package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.StudentCreateDTO;
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
@Document(collection = "student")
public class Student {
    @Id
    private String id;
    private String email;
    @Field(targetType = FieldType.STRING)
    private List<UUID> subjectIDs;
    private List<Semester2> semesters;

    public Student(StudentCreateDTO dto) {
        this.id = dto.getId();
        this.email = dto.getEmail();
        this.subjectIDs = dto.getSubjectIDs();
        this.semesters = new ArrayList<>();
    }
}
