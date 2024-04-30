package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.CalenderC;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseUpdateScoreDTO {
    private String fileName;
    private UUID courseID;
}
