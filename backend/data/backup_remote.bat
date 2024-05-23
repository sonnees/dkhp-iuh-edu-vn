@echo off
setlocal

REM Đặt mật khẩu cho PostgreSQL
set PGPASSWORD=xIJnU9OuEFtfTLufUIGWDj1jy4KnEBMp

REM Thực hiện sao lưu cơ sở dữ liệu dưới dạng tệp SQL
pg_dump -h dpg-cp1dnl21hbls73bjogpg-a.singapore-postgres.render.com -U authenticationservice_user -d authenticationservice -F p -f "backup1.sql"

endlocal
