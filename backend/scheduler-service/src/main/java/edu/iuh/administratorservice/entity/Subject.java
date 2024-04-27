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
@Document(collection = "subject")
public class Subject {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String name;
    private int creditUnits;
    private int theorySessions;
    private int practicalSessions;
    @Field(targetType = FieldType.STRING)
    private List<UUID> prerequisites;

    public Subject(SubjectCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.name = dto.getName();
        this.creditUnits = dto.getCreditUnits();
        this.theorySessions = dto.getTheorySessions();
        this.practicalSessions = dto.getPracticalSessions();
        this.prerequisites = dto.getPrerequisites();
    }
}
