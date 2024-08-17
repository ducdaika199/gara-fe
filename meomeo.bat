@echo off
REM Check if Docker is running
docker info >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo Docker is not running. Attempting to start Docker...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    REM Wait for Docker to start. Adjust the timeout as necessary.
    timeout /t 30
    REM Check again if Docker is running
    docker info >nul 2>&1
    IF %ERRORLEVEL% NEQ 0 (
        echo Failed to start Docker. Please start Docker manually and try again.
        exit /b 1
    )
)
REM Start Docker Compose services
echo Starting Docker Compose services...
docker compose up -d
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to start Docker Compose services.
    exit /b 1
)
REM Wait for a few seconds to ensure services are up
timeout /t 10

REM Start the application
echo Opening Google Chrome at localhost:3000...
@REM copy as path here
start "" "D:\Gara.lnk" http://localhost:3000

@REM REM Push database schema with Prisma
@REM echo Starting db push...
@REM npx prisma db push
@REM IF %ERRORLEVEL% NEQ 0 ( 
@REM     echo Failed to push database schema with Prisma.
@REM     pause
@REM     exit /b 1
@REM ) ELSE (
@REM     echo DB push successful.
@REM )

echo Project setup complete.

