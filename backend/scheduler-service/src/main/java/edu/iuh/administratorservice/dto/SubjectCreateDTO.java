package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Subject;
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
public class SubjectCreateDTO {
    private String name;
    private int creditUnits;
    private int theorySessions;
    private int practicalSessions;
    private List<UUID> prerequisites;
}
