#!/bin/bash

# ===========================
# MAISON ARTISAN 서버 배포 스크립트 (EC2에서 실행)
# ===========================
# deploy.sh에서 ssh로 자동 호출됨. 직접 실행 금지.

set -e

APP_DIR="/home/ubuntu/app"

echo "==== [1/2] Spring Boot 빌드 ===="
cd $APP_DIR
git pull origin master
chmod +x ./gradlew
./gradlew clean bootJar -x test

echo "==== [2/2] 앱 재시작 ===="
sudo systemctl restart unikraft

echo ""
echo "==== 서버 배포 완료! ===="
echo "상태 확인: sudo systemctl status unikraft"
echo "로그 확인: sudo journalctl -u unikraft -f"
