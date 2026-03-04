#!/bin/bash

# ===========================
# MAISON ARTISAN 배포 스크립트 (로컬 실행)
# ===========================
# 사용법: ./deploy.sh
# 전제조건: SSH 키가 아래 경로에 존재해야 함

set -e

KEY="C:/unikraft-key.pem"
SERVER="ubuntu@43.203.121.221"
APP_DIR="/home/ubuntu/app"

echo "==== [1/4] 최신 코드 git pull ===="
git pull origin master

echo "==== [2/4] React 로컬 빌드 ===="
cd src/frontend
npm install --silent
npm run build
cd ../..

echo "==== [3/4] 빌드 결과물 서버로 전송 ===="
scp -i "$KEY" -r src/frontend/build/* $SERVER:/var/www/unikraft/

echo "==== [4/4] 서버 Spring Boot 빌드 & 재시작 ===="
ssh -i "$KEY" $SERVER "bash $APP_DIR/deploy-server.sh"

echo ""
echo "==== 배포 완료! ===="
