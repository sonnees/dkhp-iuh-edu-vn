package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegistrationFormRemoveDTO {
    private String id;
    private UUID semesterID;
    private UUID subjectID;
    private UUID registrationFormID;
}
