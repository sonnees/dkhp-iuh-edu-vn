@echo off

set PGPASSWORD=password

psql -U postgres -c "DROP DATABASE IF EXISTS AuthenticationService"

psql -U postgres -c "CREATE DATABASE AuthenticationService"

psql -U postgres -d AuthenticationService -f backup.sql

