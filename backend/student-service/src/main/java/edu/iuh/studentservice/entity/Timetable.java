package edu.iuh.studentservice.entity;

import edu.iuh.studentservice.dto.TimetableCreateDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "timetable")
public class Timetable {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private String[] studentID;
    private String subjectName;
    @Field(targetType = FieldType.STRING)
    private UUID courseID;
    private ClassHour classHour;
    private ClassRoom classRoom;
    private Date date;
    private String staffName;

    public Timetable(TimetableCreateDTO dto) {
        this.id = UUID.randomUUID();
        this.studentID = dto.getStudentID();
        this.subjectName = dto.getSubjectName();
        this.courseID = dto.getCourseID();
        this.classHour = dto.getClassHour();
        this.classRoom = dto.getClassRoom();
        this.date = dto.getDate();
        this.staffName = dto.getStaffName();
    }
}
