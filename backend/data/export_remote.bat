@echo off

REM Đường dẫn kết nối đến MongoDB
set URI="mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net"

REM AdministratorService
mongoexport --uri %URI%/AdministratorService --collection staff --out staff_administratorservice_export.json
mongoexport --uri %URI%/AdministratorService --collection classes --out classes_administratorservice_export.json
mongoexport --uri %URI%/AdministratorService --collection majors --out majors_administratorservice_export.json
mongoexport --uri %URI%/AdministratorService --collection department --out department_administratorservice_export.json

REM SchedulerService
mongoexport --uri %URI%/SchedulerService --collection semester --out semester_schedulerservice_export.json
mongoexport --uri %URI%/SchedulerService --collection subject --out subject_schedulerservice_export.json
mongoexport --uri %URI%/SchedulerService --collection course --out course_schedulerservice_export.json
mongoexport --uri %URI%/SchedulerService --collection detail_course --out detail_course_schedulerservice_export.json
mongoexport --uri %URI%/SchedulerService --collection registration_form --out registration_form_schedulerservice_export.json
mongoexport --uri %URI%/SchedulerService --collection student --out student_schedulerservice_export.json

REM StudentService
mongoexport --uri %URI%/StudentService --collection academic_results --out academic_results_studentservice_export.json
mongoexport --uri %URI%/StudentService --collection student --out student_studentservice_export.json
mongoexport --uri %URI%/StudentService --collection timetable --out timetable_studentservice_export.json

echo Dữ liệu đã được export thành công.
pause
