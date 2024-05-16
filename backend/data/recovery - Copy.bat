@echo off

set PGPASSWORD=xIJnU9OuEFtfTLufUIGWDj1jy4KnEBMp 

psql -h dpg-cp1dnl21hbls73bjogpg-a.singapore-postgres.render.com -U authenticationservice_user authenticationservice -d authenticationservice -f backup1.sql
