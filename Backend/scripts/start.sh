#!/bin/bash

echo "===== Starting FinSmart Application ====="

APP_NAME="FinSmart_Finances-0.0.1-SNAPSHOT.jar"
APP_DIR="/opt/finsmart"

cd $APP_DIR

echo "Checking if app is already running..."
PID=$(pgrep -f $APP_NAME)

if [ ! -z "$PID" ]; then
    echo "App already running with PID $PID. Stopping first..."
    kill -9 $PID
    sleep 5
fi

echo "Starting application..."
nohup java -jar $APP_NAME > app.log 2>&1 &

echo "Application started successfully!"
