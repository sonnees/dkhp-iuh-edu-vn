package edu.iuh.administratorservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffDTO {
    private String id;
    private String fullName;
    private UUID departmentID;
}
