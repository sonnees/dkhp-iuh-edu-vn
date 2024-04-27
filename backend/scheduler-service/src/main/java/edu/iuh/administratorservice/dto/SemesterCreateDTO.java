package edu.iuh.administratorservice.dto;

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
public class SemesterCreateDTO {
    private int year;
    private int semesterNumber;
}
