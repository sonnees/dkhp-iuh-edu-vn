package edu.iuh.administratorservice.serialization;

import edu.iuh.administratorservice.dto.AcademicResultsUpdateScoreDTO;
import edu.iuh.administratorservice.dto.CourseCreateDTO;
import edu.iuh.administratorservice.dto.RegistrationSearchByCourseIDDTO;
import edu.iuh.administratorservice.entity.CalenderC;
import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.enums.ClassHour;
import edu.iuh.administratorservice.enums.ClassRoom;
import edu.iuh.administratorservice.repository.CourseRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Date;
import java.time.Instant;
import java.util.*;

@Slf4j
@Component
@AllArgsConstructor
public class ExcelFileHandle {
    private CourseRepository courseRepository;
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

    public void writeToExcel(RegistrationSearchByCourseIDDTO studentIDs, String fileName, String courseID) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet(courseID);

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("stt");
        headerRow.createCell(1).setCellValue("Student ID");
        headerRow.createCell(2).setCellValue("Theory Score 1");
        headerRow.createCell(3).setCellValue("Theory Score 2");
        headerRow.createCell(4).setCellValue("Theory Score 3");
        headerRow.createCell(5).setCellValue("Practical Score 1");
        headerRow.createCell(6).setCellValue("Practical Score 2");
        headerRow.createCell(7).setCellValue("Practical Score 3");
        headerRow.createCell(8).setCellValue("Midterm Score");
        headerRow.createCell(9).setCellValue("Final Score");

        int rowNum = 1;
        for (String studentID : studentIDs.getStudentIDs()) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(rowNum-1);
            row.createCell(1).setCellValue(studentID);
            row.createCell(2).setCellValue(0);
            row.createCell(3).setCellValue(0);
            row.createCell(4).setCellValue(0);
            row.createCell(5).setCellValue(0);
            row.createCell(6).setCellValue(0);
            row.createCell(7).setCellValue(0);
            row.createCell(8).setCellValue(0);
            row.createCell(9).setCellValue(0);
        }

        try (FileOutputStream fileOut = new FileOutputStream(fileName)) {
            workbook.write(fileOut);
            workbook.close();
            System.out.println("Excel file has been created successfully.");
        } catch (Exception e) {
            System.out.println("An error occurred while creating the Excel file: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }


    public List<AcademicResultsUpdateScoreDTO> toScore(String fileName, Course course) {
        try {
            FileInputStream file = new FileInputStream(fileName);
            Workbook workbook = WorkbookFactory.create(file);
            Sheet sheet = workbook.getSheetAt(0);
            String courseID = sheet.getSheetName();
            Iterator<Row> rowIterator = sheet.iterator();
            List<AcademicResultsUpdateScoreDTO> list = new ArrayList<>();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if (row.getRowNum() == 0) {
                    continue;
                }
                Iterator<Cell> cellIterator = row.cellIterator();
                AcademicResultsUpdateScoreDTO object = new AcademicResultsUpdateScoreDTO();
                object.setSubjectID(course.getSubject().getId());
                object.setSemesterID(course.getSemester().getId());
                List<Double> theoryScore = new ArrayList<>();
                List<Double> practicalScore = new ArrayList<>();
                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    switch (cell.getColumnIndex()) {
                        case 1: // Student ID
                            object.setId(cell.getStringCellValue());
                            break;
                        case 2,3,4: // Theory Score
                            theoryScore.add(cell.getNumericCellValue());
                            break;
                        case 5,6,7: // Practical Score
                            practicalScore.add(cell.getNumericCellValue());
                            break;
                        case 8: // Midterm Score
                            object.setMidtermScore(cell.getNumericCellValue());
                            break;
                        case 9: // Final Score
                            object.setFinalScore(cell.getNumericCellValue());
                            break;

                    }
                }
                object.setTheoryScore(theoryScore.stream().mapToDouble(Double::floatValue).toArray());
                object.setPracticalScore(practicalScore.stream().mapToDouble(Double::floatValue).toArray());
                list.add(object);
            }
            workbook.close();
            file.close();
            return list;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
