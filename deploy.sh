#!/bin/bash

# ===========================
# MAISON ARTISAN 배포 스크립트
# ===========================
# 사용법: ./deploy.sh
# 전제조건: env.properties가 ~/app/ 에 존재해야 함

set -e

APP_DIR="/home/ubuntu/app"
JAR_NAME="unikraft-0.0.1-SNAPSHOT.jar"
SPRING_PROFILE="prod"

echo "==== [1/5] 최신 코드 받기 ===="
cd $APP_DIR
git pull origin master

echo "==== [2/5] React 빌드 ===="
cd $APP_DIR/src/frontend
npm install --silent
npm run build

echo "==== [3/5] React 빌드 결과를 Nginx 서빙 위치로 복사 ===="
sudo cp -r $APP_DIR/src/frontend/build/* /var/www/unikraft/

echo "==== [4/5] Spring Boot 빌드 ===="
cd $APP_DIR
chmod +x ./gradlew
./gradlew clean bootJar -x test

echo "==== [5/5] 앱 재시작 ===="
sudo systemctl restart unikraft

echo ""
echo "==== 배포 완료! ===="
echo "상태 확인: sudo systemctl status unikraft"
echo "로그 확인: sudo journalctl -u unikraft -f"
