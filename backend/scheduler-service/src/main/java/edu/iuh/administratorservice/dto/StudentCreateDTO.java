package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Semester2;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentCreateDTO {
    private String id;
    private String email;
    private List<UUID> subjectIDs;
}
