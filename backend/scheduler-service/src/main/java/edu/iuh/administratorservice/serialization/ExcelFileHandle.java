package edu.iuh.administratorservice.serialization;

import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.entity.CalenderC;
import edu.iuh.administratorservice.enums.ClassHour;
import edu.iuh.administratorservice.enums.ClassRoom;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.sql.Date;
import java.time.Instant;
import java.util.*;

@Slf4j
@Component
public class ExcelFileHandle {
    public List<CourseCreateDTO> toCourseCreate(String fileName) {
        try {
            FileInputStream file = new FileInputStream(fileName);
            Workbook workbook = WorkbookFactory.create(file);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            List<CourseCreateDTO> courseInfoList = new ArrayList<>();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if (row.getRowNum() == 0) {
                    continue;
                }
                Iterator<Cell> cellIterator = row.cellIterator();
                CourseCreateDTO courseInfo = new CourseCreateDTO();
                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    switch (cell.getColumnIndex()) {
                        case 1: // subjectID
                            courseInfo.setSubjectId(UUID.fromString(cell.getStringCellValue()));
                            break;
                        case 2: // semesterID
                            courseInfo.setSemesterId(UUID.fromString(cell.getStringCellValue()));
                            break;
                        case 3: // tuitionFee
                            courseInfo.setTuitionFee((long) cell.getNumericCellValue());
                            break;
                        case 4: // theoryStaff
                            courseInfo.setTheoryStaff(cell.getStringCellValue());
                            break;
                        case 5: // practicalStaff
                            if(cell.getStringCellValue().isBlank()) continue;
                            log.info("** {}", cell.getStringCellValue());
                            String[] practicalStaff = cell.getStringCellValue().split(",");
                            log.info("*** {}", cell.getStringCellValue());
                            List<String> staffIdList = new ArrayList<>();
                            for (String staffId : practicalStaff) {
                                staffIdList.add(staffId.trim());
                            }
                            log.info("**** {}", staffIdList);
                            courseInfo.setPracticalStaff(staffIdList);
                            break;
                        case 6: // theorySize
                            courseInfo.setTheorySize((int) cell.getNumericCellValue());
                            break;
                        case 7: // theoryCalender
                            String[] staffIds = cell.getStringCellValue().split(",");
                            CalenderC calenderC = new CalenderC(
                                    ClassHour.valueOf(staffIds[0].strip()),
                                    ClassRoom.valueOf(staffIds[1].strip()),
                                    Date.from(Instant.parse(staffIds[2].strip())),
                                    Date.from(Instant.parse(staffIds[3].strip()))
                            );
                            courseInfo.setTheoryCalender(calenderC);
                            break;
                        case 8: // practicalCalender1
                            if(cell.getStringCellValue().isBlank()) continue;
                            String[] practicalCalender1 = cell.getStringCellValue().split(",");
                            courseInfo.setPracticalCalender1(
                                    new CalenderC(
                                            ClassHour.valueOf(practicalCalender1[0].strip()),
                                            ClassRoom.valueOf(practicalCalender1[1].strip()),
                                            Date.from(Instant.parse(practicalCalender1[2].strip())),
                                            Date.from(Instant.parse(practicalCalender1[3].strip())))
                            );
                            break;
                        case 9: // practicalCalender2
                            if(cell.getStringCellValue().isBlank()) continue;
                            String[] practicalCalender2 = cell.getStringCellValue().split(",");
                            courseInfo.setPracticalCalender2(
                                    new CalenderC(
                                            ClassHour.valueOf(practicalCalender2[0].strip()),
                                            ClassRoom.valueOf(practicalCalender2[1].strip()),
                                            Date.from(Instant.parse(practicalCalender2[2].strip())),
                                            Date.from(Instant.parse(practicalCalender2[3].strip()))
                                    )
                            );
                            break;
                        case 10: // practicalCalender3
                            if(cell.getStringCellValue().isBlank()) continue;
                            String[] practicalCalender3 = cell.getStringCellValue().split(",");
                            courseInfo.setPracticalCalender3(
                                    new CalenderC(
                                            ClassHour.valueOf(practicalCalender3[0].strip()),
                                            ClassRoom.valueOf(practicalCalender3[1].strip()),
                                            Date.from(Instant.parse(practicalCalender3[2].strip())),
                                            Date.from(Instant.parse(practicalCalender3[3].strip())))
                            );
                            break;
                    }
                }
                courseInfoList.add(courseInfo);
            }
            workbook.close();
            file.close();
            return courseInfoList;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
