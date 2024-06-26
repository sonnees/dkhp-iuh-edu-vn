package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "course")
public class Course {
    @Field(targetType = FieldType.STRING)
    @Id
    private UUID id;
    private Subject subject;
    private long tuitionFee;
    @Indexed
    private Semester semester;
    private Status status;

    public Course(Semester semester, Subject subject, long tuitionFee) {
        this.id = UUID.randomUUID();
        this.subject = subject;
        this.tuitionFee = tuitionFee;
        this.semester = semester;
        this.status = Status.PREPARING;
    }
}
