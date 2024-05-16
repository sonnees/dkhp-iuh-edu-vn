mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/AdministratorService" --collection staff --file staff.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/AdministratorService" --collection classes --file classes.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/AdministratorService" --collection majors --file majors.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/AdministratorService" --collection department --file department.json

mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection semester --file semester.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection subject --file subject.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection course --file course.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection detail_course --file detail_course.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection registration_form --file registration_form.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/SchedulerService" --collection student --file student_.json

mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/StudentService" --collection academic_results --file academic_results.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/StudentService" --collection student --file student.json
mongoimport --uri "mongodb+srv://sonnees:8ymAG8ia1s88DwXO@cluster0.m0vbmbu.mongodb.net/StudentService" --collection timetable --file timetable.json
