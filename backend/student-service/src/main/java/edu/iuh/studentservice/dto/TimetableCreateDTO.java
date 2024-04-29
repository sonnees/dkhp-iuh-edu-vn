package edu.iuh.studentservice.dto;

import edu.iuh.studentservice.entity.ClassHour;
import edu.iuh.studentservice.entity.ClassRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.UUID;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TimetableCreateDTO {
    @Field(targetType = FieldType.STRING)
    private String[] studentID;
    private String subjectName;
    @Field(targetType = FieldType.STRING)
    private UUID courseID;
    private ClassHour classHour;
    private ClassRoom classRoom;
    private Date date;
    private String staffName;

}
