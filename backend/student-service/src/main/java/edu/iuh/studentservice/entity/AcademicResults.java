package edu.iuh.studentservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "academic_results")
public class AcademicResults {
    @Id
    private String id;
    private List<Semester> semesters;

    public AcademicResults(String id) {
        this.id = id;
        this.semesters = new ArrayList<>();
    }
}

