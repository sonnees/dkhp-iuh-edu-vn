package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.Subject2;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class StudentAppendSubjectDTO {
    private String id;
    private UUID semesterID;
    private Subject2 subject;
}
