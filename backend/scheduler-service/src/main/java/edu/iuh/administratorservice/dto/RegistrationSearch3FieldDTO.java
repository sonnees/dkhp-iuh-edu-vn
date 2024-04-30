package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegistrationSearch3FieldDTO {
    private UUID idCourse;
    private int groupNumber;
    private String[] studentID;
}
