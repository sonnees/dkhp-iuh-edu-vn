package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.StudentCreateDTO;
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
@Document(collection = "student")
public class Student {
    private String id;
    private String fullName;
    private boolean sex;
    private String phoneNumber;
    private String email;
    private String address;
    private Classes classes;
    private Status status;

    public Student(String id, StudentCreateDTO dto, Classes classes ) {
        this.id = id;
        this.fullName = dto.getFullName();
        this.sex = dto.isSex();
        this.phoneNumber = dto.getPhoneNumber();
        this.email = dto.getEmail();
        this.address = dto.getAddress();
        this.classes = classes;
        this.status = Status.ACTIVE;
    }
}

