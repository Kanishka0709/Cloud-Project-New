#!/bin/bash

echo "===== Starting FinSmart Application ====="

APP_NAME="Finsmart_Finances-0.0.1-SNAPSHOT.jar"
APP_DIR="/opt/finsmart"
LOG_FILE="$APP_DIR/app.log"

cd $APP_DIR

# Stop if already running
PID=$(pgrep -f $APP_NAME)
if [ ! -z "$PID" ]; then
    echo "App already running with PID $PID. Stopping first..."
    kill -9 $PID
    sleep 3
fi

# -------------------------------------------------------
# Set your DB credentials here OR pull from Secrets Manager
# If using Secrets Manager, uncomment the block below:
# -------------------------------------------------------
# SECRET=$(aws secretsmanager get-secret-value \
#   --secret-id finsmart/app-config \
#   --query SecretString \
#   --output text --region us-east-1)
# DB_URL=$(echo $SECRET | python3 -c "import sys,json; print(json.load(sys.stdin)['db_url'])")
# DB_USER=$(echo $SECRET | python3 -c "import sys,json; print(json.load(sys.stdin)['db_username'])")
# DB_PASS=$(echo $SECRET | python3 -c "import sys,json; print(json.load(sys.stdin)['db_password'])")

echo "Starting Spring Boot application..."
nohup java -jar $APP_DIR/$APP_NAME \
    --server.port=8080 \
    > $LOG_FILE 2>&1 &

echo "Application started. Logs at $LOG_FILE"

# Setup nginx to serve React frontend
if command -v nginx &> /dev/null; then
    cat > /etc/nginx/conf.d/finsmart.conf << 'EOF'
server {
    listen 80;
    server_name _;

    # Serve React frontend
    location / {
        root /opt/finsmart/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Spring Boot
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
    systemctl enable nginx
    systemctl restart nginx
    echo "Nginx configured and started."
fi
