@echo off
set PGPASSWORD=password
pg_dump -U postgres -d AuthenticationService > backup.sql
