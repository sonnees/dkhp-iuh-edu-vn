@echo off

mongosh AdministratorService --eval "db.department.drop()"
mongosh AdministratorService --eval "db.majors.drop()"
mongosh AdministratorService --eval "db.classes.drop()"
mongosh AdministratorService --eval "db.semester.drop()"
mongosh AdministratorService --eval "db.staff.drop()"
mongosh AdministratorService --eval "db.subject.drop()"
mongosh AdministratorService --eval "db.course.drop()"
mongosh AdministratorService --eval "db.detail_course.drop()"

mongoimport --db AdministratorService --collection department --file department.json
mongoimport --db AdministratorService --collection majors --file majors.json
mongoimport --db AdministratorService --collection classes --file classes.json
mongoimport --db AdministratorService --collection semester --file semester.json
mongoimport --db AdministratorService --collection staff --file staff.json
mongoimport --db AdministratorService --collection subject --file subject.json
mongoimport --db AdministratorService --collection course --file course.json
mongoimport --db AdministratorService --collection detail_course --file detail_course.json
