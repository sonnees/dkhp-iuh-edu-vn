package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.CalenderC;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseCreateDTO {
    private UUID subjectId;
    private UUID semesterId;
    private long tuitionFee;
    private String theoryStaff;
    private List<String> practicalStaff = new ArrayList<>();
    private int theorySize;
    private CalenderC theoryCalender;
    private CalenderC practicalCalender1;
    private CalenderC practicalCalender2;
    private CalenderC practicalCalender3;
}
