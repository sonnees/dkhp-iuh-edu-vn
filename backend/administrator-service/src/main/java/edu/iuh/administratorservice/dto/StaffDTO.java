package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StaffDTO {
    @Id
    private String id;
    private String fullName;
}
