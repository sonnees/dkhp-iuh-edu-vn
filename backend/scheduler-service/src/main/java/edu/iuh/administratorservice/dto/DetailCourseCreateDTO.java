package edu.iuh.administratorservice.dto;

import edu.iuh.administratorservice.entity.CalenderC;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetailCourseCreateDTO {
    private UUID courseID;
    private String staffID;
    private int classSize;
    private int groupNumber;
    private CalenderC calender;
}
