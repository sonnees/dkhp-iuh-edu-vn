@echo off
REM File import.bat - Import dữ liệu vào MongoDB

REM Đường dẫn kết nối đến MongoDB
set URI="mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net"

REM AdministratorService - Xóa dữ liệu trước khi import
mongosh %URI%/AdministratorService --eval "db.staff.drop()"
mongosh %URI%/AdministratorService --eval "db.classes.drop()"
mongosh %URI%/AdministratorService --eval "db.majors.drop()"
mongosh %URI%/AdministratorService --eval "db.department.drop()"

REM SchedulerService - Xóa dữ liệu trước khi import
mongosh %URI%/SchedulerService --eval "db.semester.drop()"
mongosh %URI%/SchedulerService --eval "db.subject.drop()"
mongosh %URI%/SchedulerService --eval "db.course.drop()"
mongosh %URI%/SchedulerService --eval "db.detail_course.drop()"
mongosh %URI%/SchedulerService --eval "db.registration_form.drop()"
mongosh %URI%/SchedulerService --eval "db.student.drop()"

REM StudentService - Xóa dữ liệu trước khi import
mongosh %URI%/StudentService --eval "db.academic_results.drop()"
mongosh %URI%/StudentService --eval "db.student.drop()"
mongosh %URI%/StudentService --eval "db.timetable.drop()"

REM AdministratorService
mongoimport --uri %URI%/AdministratorService --collection staff --file staff_administratorservice_export.json
mongoimport --uri %URI%/AdministratorService --collection classes --file classes_administratorservice_export.json
mongoimport --uri %URI%/AdministratorService --collection majors --file majors_administratorservice_export.json
mongoimport --uri %URI%/AdministratorService --collection department --file department_administratorservice_export.json

REM SchedulerService
mongoimport --uri %URI%/SchedulerService --collection semester --file semester_schedulerservice_export.json
mongoimport --uri %URI%/SchedulerService --collection subject --file subject_schedulerservice_export.json
mongoimport --uri %URI%/SchedulerService --collection course --file course_schedulerservice_export.json
mongoimport --uri %URI%/SchedulerService --collection detail_course --file detail_course_schedulerservice_export.json
mongoimport --uri %URI%/SchedulerService --collection registration_form --file registration_form_schedulerservice_export.json
mongoimport --uri %URI%/SchedulerService --collection student --file student_schedulerservice_export.json

REM StudentService
mongoimport --uri %URI%/StudentService --collection academic_results --file academic_results_studentservice_export.json
mongoimport --uri %URI%/StudentService --collection student --file student_studentservice_export.json
mongoimport --uri %URI%/StudentService --collection timetable --file timetable_studentservice_export.json

echo Dữ liệu đã được import thành công.
pause
