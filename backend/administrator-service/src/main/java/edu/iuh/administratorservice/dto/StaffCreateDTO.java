package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffCreateDTO {
    private String fullName;
    private UUID departmentID;
}
