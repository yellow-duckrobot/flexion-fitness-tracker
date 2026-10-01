@echo off
REM Flexion automated MongoDB backup (Windows Task Scheduler can run this daily)
REM Usage: backup.bat   (run from the backend folder, or schedule it)

set BACKUP_DIR=C:\FlexionBackups
set DB_NAME=flexion

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%
mongodump --db %DB_NAME% --out %BACKUP%\backup-%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%-%TIME:~0,2%%TIME:~3,2%
echo Backup complete: %BACKUP_DIR%