package edu.iuh.administratorservice.entity;

import edu.iuh.administratorservice.enums.ClassHour;
import edu.iuh.administratorservice.enums.ClassRoom;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CalenderC {
    private ClassHour classHour;
    private ClassRoom classRoom;
    private Date start;
    private Date end;
}
