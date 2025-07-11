@echo off
set PSQL="C:\Program Files\PostgreSQL\17\bin\psql.exe"
set USER=postgres
set DB=sakila
set SCHEMA_FILE=C:\Users\ADMIN\sakila-migration\init\sakila-schema.sql
set DATA_FILE=C:\Users\ADMIN\sakila-migration\init\sakila-data-utf8.sql

echo Suppression de la base %DB%...
%PSQL% -U %USER% -c "DROP DATABASE IF EXISTS %DB%;"

echo Création de la base %DB%...
%PSQL% -U %USER% -c "CREATE DATABASE %DB%;"

echo Import du schéma...
%PSQL% -U %USER% -d %DB% -f %SCHEMA_FILE%

echo Import des données...
%PSQL% -U %USER% -d %DB% -f %DATA_FILE%

echo Import terminé.
pause
