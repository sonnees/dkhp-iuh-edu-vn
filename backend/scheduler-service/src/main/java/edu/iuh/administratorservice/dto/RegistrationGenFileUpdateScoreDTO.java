package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegistrationGenFileUpdateScoreDTO {
    private UUID courseID;
    private String fileName;
}
