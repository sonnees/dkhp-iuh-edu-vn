package edu.iuh.administratorservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "registration_form")
public class RegistrationForm {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;

    @Indexed()
    private String studentID;
    private Course course;
    private int groupNumber;
    private Date submitDate;

    public RegistrationForm(String studentID, Course course, int groupNumber) {
        this.id = UUID.randomUUID();
        this.studentID = studentID;
        this.course = course;
        this.groupNumber = groupNumber;
        this.submitDate = new Date();
    }
}
