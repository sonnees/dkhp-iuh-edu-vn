package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.SubjectCreateDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Subject2 {
    @Field(targetType = FieldType.STRING)
    private UUID id;
    @Field(targetType = FieldType.STRING)
    private UUID registrationFormID;
    private String name;
    private int creditUnits;

    public Subject2(RegistrationForm registrationForm) {
        this.id = registrationForm.getCourse().getSubject().getId();
        this.registrationFormID = registrationForm.getId();
        this.name = registrationForm.getCourse().getSubject().getName();
        this.creditUnits = registrationForm.getCourse().getSubject().getCreditUnits();
    }
}
