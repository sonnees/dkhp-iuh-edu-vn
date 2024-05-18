@echo off
setlocal

for /d %%d in (*) do (
    pushd "%%d"
    set image_name=%%~nd
    if exist "Dockerfile" (
        docker build -t %%d .
    )
    popd
)

endlocal

docker-compose up -d
