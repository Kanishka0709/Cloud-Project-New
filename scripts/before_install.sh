#!/bin/bash

echo "===== Before Install: Setting up directories ====="

# Create app directory
mkdir -p /opt/finsmart
mkdir -p /opt/finsmart/frontend

# Install Java 17 if not present
if ! java -version 2>&1 | grep -q "17"; then
    echo "Installing Java 17..."
    dnf install -y java-17-amazon-corretto
fi

# Install nginx if not present (to serve React frontend)
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    dnf install -y nginx
fi

echo "Before install complete."
