package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.MajorsCreateDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "majors")
public class Majors {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;

    private String name;

    @Field(targetType = FieldType.STRING)
    private UUID departmentID;

    @Field(targetType = FieldType.STRING)
    private UUID[] electiveSubjects;

    @Field(targetType = FieldType.STRING)
    private UUID[] requiredCourses;

    public Majors(MajorsCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.name = dto.getName();
        this.departmentID = dto.getDepartmentID();
        this.electiveSubjects = dto.getElectiveSubjects();
        this.requiredCourses = dto.getRequiredCourses();
    }
}
