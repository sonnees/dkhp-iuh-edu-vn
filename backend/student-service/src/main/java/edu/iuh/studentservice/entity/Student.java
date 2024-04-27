package edu.iuh.studentservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

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
    @Field(targetType = FieldType.STRING)
    private UUID classesID;
    private Status status;
}

