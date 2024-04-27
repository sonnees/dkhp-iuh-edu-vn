package edu.iuh.administratorservice.serialization;

import edu.iuh.administratorservice.dto.StudentCreateDTO;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.util.*;

@Slf4j
@Component
public class ExcelFileHandle {
    public List<StudentCreateDTO> toStudentCreate(String fileName) {
        try {
            FileInputStream file = new FileInputStream(fileName);
            Workbook workbook = WorkbookFactory.create(file);
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();
            List<StudentCreateDTO> studentCreateDTOS = new ArrayList<>();
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                if (row.getRowNum() == 0) {
                    continue;
                }
                Iterator<Cell> cellIterator = row.cellIterator();
                StudentCreateDTO student = new StudentCreateDTO();
                while (cellIterator.hasNext()) {
                    Cell cell = cellIterator.next();
                    switch (cell.getColumnIndex()) {
                        case 1: // fullName
                            student.setFullName(cell.getStringCellValue().strip());
                            break;
                        case 2: // sex
                            student.setSex((int) cell.getNumericCellValue() != 0);
                            break;
                        case 3: // phoneNumber
                            student.setPhoneNumber(cell.getStringCellValue().strip());
                            break;
                        case 4: // email
                            student.setEmail(cell.getStringCellValue().strip());
                            break;
                        case 5: // address
                            student.setAddress(cell.getStringCellValue().strip());
                            break;
                        case 6: // classesID
                            log.info("** {}",cell.getStringCellValue().strip());
                            student.setClassesID(UUID.fromString(cell.getStringCellValue().strip()));
                            break;
                    }
                }
                studentCreateDTOS.add(student);
            }
            workbook.close();
            file.close();
            return studentCreateDTOS;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
