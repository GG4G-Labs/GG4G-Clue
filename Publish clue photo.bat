@echo off
rem Publishes the ChUMMY clue photo to https://gg4g-labs.github.io/GG4G-Clue/
rem Drop a photo onto this file, or double-click it and pick one.
rem ASCII with CRLF endings: cmd reads it in the console codepage.
title Publish clue photo
cd /d "%~dp0"
set "PHOTO=%~1"
if "%PHOTO%"=="" for /f "usebackq delims=" %%F in (`powershell -NoProfile -STA -Command "Add-Type -AssemblyName System.Windows.Forms; $d = New-Object System.Windows.Forms.OpenFileDialog; $d.Title = 'Pick the clue photo'; $d.Filter = 'Photos|*.jpg;*.jpeg;*.png'; if ($d.ShowDialog() -eq 'OK') { $d.FileName }"`) do set "PHOTO=%%F"
if "%PHOTO%"=="" (
  echo   No photo picked. Nothing was published.
  pause
  exit /b 1
)
node publish.js "%PHOTO%"
pause
