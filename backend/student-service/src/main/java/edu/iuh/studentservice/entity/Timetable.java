package edu.iuh.studentservice.entity;

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
    @Field(targetType = FieldType.STRING)
    private List<UUID> studentID;
    private String subjectName;
    private UUID courseID;
    private ClassHour classHour;
    private ClassRoom classRoom;
    private Date date;
    private String staffName;

    public Timetable(List<UUID> studentID, String subjectName, UUID courseID, ClassHour classHour, ClassRoom classRoom, Date date, String staffName) {
        this.id = UUID.randomUUID();
        this.studentID = studentID;
        this.subjectName = subjectName;
        this.courseID = courseID;
        this.classHour = classHour;
        this.classRoom = classRoom;
        this.date = date;
        this.staffName = staffName;
    }
}
