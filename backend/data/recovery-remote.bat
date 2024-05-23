@echo off
setlocal

REM Đặt mật khẩu cho PostgreSQL
set PGPASSWORD=xIJnU9OuEFtfTLufUIGWDj1jy4KnEBMp

REM Xóa các bảng và trình tự hiện có
psql -h dpg-cp1dnl21hbls73bjogpg-a.singapore-postgres.render.com -U authenticationservice_user -d authenticationservice -c "DROP TABLE IF EXISTS student_auth CASCADE;"
psql -h dpg-cp1dnl21hbls73bjogpg-a.singapore-postgres.render.com -U authenticationservice_user -d authenticationservice -c "DROP SEQUENCE IF EXISTS entity_seq CASCADE;"

REM Thực hiện khôi phục cơ sở dữ liệu từ tệp SQL
psql -h dpg-cp1dnl21hbls73bjogpg-a.singapore-postgres.render.com -U authenticationservice_user -d authenticationservice -f "backup1.sql"

endlocal
