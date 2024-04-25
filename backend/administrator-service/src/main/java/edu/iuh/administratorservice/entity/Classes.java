package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.ClassesCreateDTO;
import edu.iuh.administratorservice.enums.ModeOfEducation;
import edu.iuh.administratorservice.enums.TypeOfEducation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "classes")
public class Classes {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String name;
    @Field(targetType = FieldType.STRING)
    private UUID majorsID;
    private TypeOfEducation typeOfEducation;
    private ModeOfEducation modeOfEducation;

    public Classes(ClassesCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.name = dto.getName();
        this.majorsID = dto.getMajorsID();
        this.typeOfEducation = TypeOfEducation.UNIVERSITY;
        this.modeOfEducation = ModeOfEducation.REGULAR;
    }
}
