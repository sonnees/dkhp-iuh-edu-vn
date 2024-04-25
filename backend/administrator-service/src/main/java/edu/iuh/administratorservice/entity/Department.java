package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.DepartmentCreateDTO;
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
@Document(collection = "department")
public class Department {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String name;

    public Department(DepartmentCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.name = dto.getName();
    }
}
