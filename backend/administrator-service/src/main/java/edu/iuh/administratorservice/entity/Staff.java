package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.StaffCreateDTO;
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
@Document(collection = "staff")
public class Staff {
    @Id
    private String id;
    private String fullName;
    @Indexed()
    @Field(targetType = FieldType.STRING)
    private UUID departmentID;

    public Staff(long id, StaffCreateDTO dto) {
        this.id = String.valueOf(id);
        this.fullName = dto.getFullName();
        this.departmentID = dto.getDepartmentID();
    }
}
