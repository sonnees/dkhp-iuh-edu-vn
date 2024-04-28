mongoexport --db AdministratorService --collection department --out department.json
mongoexport --db AdministratorService --collection majors --out majors.json
mongoexport --db AdministratorService --collection classes --out classes.json
mongoexport --db AdministratorService --collection staff --out staff.json

mongoexport --db SchedulerService --collection semester --out semester.json
mongoexport --db SchedulerService --collection subject --out subject.json
mongoexport --db SchedulerService --collection course --out course.json
mongoexport --db SchedulerService --collection detail_course --out detail_course.json
mongoexport --db SchedulerService --collection registration_form --out registration_form.json
mongoexport --db SchedulerService --collection student --out student_.json


