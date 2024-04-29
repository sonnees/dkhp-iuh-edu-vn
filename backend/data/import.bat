@echo off

mongosh AdministratorService --eval "db.department.drop()"
mongosh AdministratorService --eval "db.majors.drop()"
mongosh AdministratorService --eval "db.classes.drop()"
mongosh AdministratorService --eval "db.staff.drop()"
mongosh SchedulerService --eval "db.semester.drop()"
mongosh SchedulerService --eval "db.subject.drop()"
mongosh SchedulerService --eval "db.course.drop()"
mongosh SchedulerService --eval "db.detail_course.drop()"
mongosh SchedulerService --eval "db.registration_form.drop()"
mongosh SchedulerService --eval "db.student.drop()"
mongosh StudentService --eval "db.student.drop()"
mongosh StudentService --eval "db.timetable.drop()"
mongosh StudentService --eval "db.academic_results.drop()"

mongoimport --db AdministratorService --collection department --file department.json
mongoimport --db AdministratorService --collection majors --file majors.json
mongoimport --db AdministratorService --collection classes --file classes.json
mongoimport --db AdministratorService --collection staff --file staff.json
mongoimport --db SchedulerService --collection semester --file semester.json
mongoimport --db SchedulerService --collection subject --file subject.json
mongoimport --db SchedulerService --collection course --file course.json
mongoimport --db SchedulerService --collection detail_course --file detail_course.json
mongoimport --db SchedulerService --collection registration_form --file registration_form.json
mongoimport --db SchedulerService --collection student --file student_.json
mongoimport --db StudentService --collection student --file student.json
mongoimport --db StudentService --collection timetable --file timetable.json
mongoimport --db StudentService --collection academic_results --file academic_results.json
