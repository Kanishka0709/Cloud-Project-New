#!/bin/bash

echo "===== Stopping FinSmart Application ====="

APP_NAME="FinSmart_Finances-0.0.1-SNAPSHOT.jar"

PID=$(pgrep -f $APP_NAME)

if [ -z "$PID" ]; then
    echo "No running application found"
else
    echo "Stopping application with PID $PID"
    kill -9 $PID
    sleep 5
    echo "Application stopped"
fi
