package edu.iuh.studentservice.dto;

import edu.iuh.studentservice.entity.ClassHour;
import edu.iuh.studentservice.entity.ClassRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimetableSearchByStudentIDDTO {
    private String studentID;
    private Date start;
    private Date end;
}
