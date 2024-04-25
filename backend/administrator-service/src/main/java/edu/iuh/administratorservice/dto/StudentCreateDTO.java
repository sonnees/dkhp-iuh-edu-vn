package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Classes;
import edu.iuh.administratorservice.enums.ClassRoom;
import edu.iuh.administratorservice.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentCreateDTO {
    private String fullName;
    private boolean sex;
    private String phoneNumber;
    private String email;
    private String address;
    private UUID classesID;
}

