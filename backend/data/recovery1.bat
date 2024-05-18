@echo off

set MYSQL_PWD=password

mariadb -u root -e "DROP DATABASE IF EXISTS AuthenticationService;"

mysql -u root -e "CREATE DATABASE AuthenticationService;"

mysql -u root AuthenticationService < backup.sql
