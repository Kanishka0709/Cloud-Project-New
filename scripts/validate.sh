#!/bin/bash

echo "===== Validating FinSmart Service ====="

sleep 15

for i in {1..6}; do
    if curl -sf http://localhost:8080 > /dev/null 2>&1; then
        echo "Backend is healthy!"
        exit 0
    fi
    echo "Attempt $i: Backend not ready yet, waiting 10s..."
    sleep 10
done

echo "ERROR: Service failed to start. Check /opt/finsmart/app.log"
cat /opt/finsmart/app.log | tail -30
exit 1
