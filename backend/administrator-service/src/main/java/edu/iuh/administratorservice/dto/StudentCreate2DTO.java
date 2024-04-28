package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentCreate2DTO {
    private String id;
    private String email;
    private List<UUID> subjectIDs;
}

