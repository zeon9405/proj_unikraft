# MAISON ARTISAN - 수공예 이커머스 플랫폼

> 장인(Artisan)들이 자신의 수공예 작품을 판매하고, 고객들이 개성 있는 수공예 제품을 구매할 수 있는 이커머스 플랫폼입니다.

---

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [주요 기능](#주요-기능)
- [개발 환경](#개발-환경)
- [디렉토리 구조](#디렉토리-구조)
- [설치 및 실행](#설치-및-실행)
- [환경 변수 설정](#환경-변수-설정)
- [API 엔드포인트](#api-엔드포인트)
- [에러 처리](#에러-처리)

---

## 프로젝트 소개

MAISON ARTISAN은 수공예 장인과 소비자를 연결하는 이커머스 플랫폼입니다.

- **장인(Master)**: 자신의 수공예 상품을 등록하고 판매
- **일반 사용자**: 상품 탐색, 장바구니, 주문, 결제
- **관리자**: 주문 관리 및 사이트 운영

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 회원가입 / 로그인 | 일반 가입, Google/Kakao 소셜 로그인, JWT 인증 |
| 상품 관리 | 상품 등록·수정·삭제, 이미지 업로드 |
| 카테고리 | 카테고리별 상품 필터링 |
| 찜하기 | 상품 좋아요/찜 기능 |
| 장바구니 | 상품 추가, 수량 관리, 제거 |
| 주문 / 결제 | Toss Payments 연동 결제 |
| 상품 문의 | Q&A, 비밀 댓글 |
| 장인 소개 | 장인 프로필 및 작품 목록 |
| 마이페이지 | 프로필 수정, 주문 내역 조회 |

---

## 개발 환경

### 백엔드

| 항목 | 버전 |
|------|------|
| Java | 17 |
| Spring Boot | 4.0.3 |
| Gradle | 9.3.1 |
| Spring Security | Spring Boot 내장 |
| Spring Data JPA | Spring Boot 내장 |
| jjwt (JWT) | 0.12.3 |
| MySQL Connector/J | 8.x (Spring Boot 관리) |
| Lombok | Spring Boot 관리 |

### 프론트엔드

| 항목 | 버전 |
|------|------|
| Node.js | 18 이상 권장 |
| npm | 9 이상 권장 |
| React | 19.2.4 |
| React Router DOM | 7.13.1 |
| Axios | 1.7.7 |

### 데이터베이스

| 항목 | 버전 / 설정 |
|------|------------|
| MySQL | 8.0 이상 |
| 데이터베이스명 | unikraft |
| 기본 포트 | 3306 |

### 외부 서비스

| 서비스 | 용도 |
|--------|------|
| Google OAuth2 | 소셜 로그인 |
| Kakao OAuth2 | 소셜 로그인 |
| Toss Payments | 결제 처리 |

---

## 디렉토리 구조

```
unikraft/
├── src/
│   ├── main/
│   │   ├── java/com/unikraft/
│   │   │   ├── domain/                    # 비즈니스 도메인
│   │   │   │   ├── user/                  # 사용자 관리
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   └── dto/
│   │   │   │   ├── product/               # 상품 관리
│   │   │   │   │   ├── category/
│   │   │   │   │   └── like/
│   │   │   │   ├── order/                 # 주문 / 결제
│   │   │   │   ├── cart/                  # 장바구니
│   │   │   │   └── inquiry/               # 상품 문의
│   │   │   └── global/                    # 공통 설정
│   │   │       ├── config/
│   │   │       │   ├── SecurityConfig.java
│   │   │       │   └── WebConfig.java
│   │   │       ├── security/
│   │   │       │   ├── jwt/               # JWT 토큰
│   │   │       │   └── oauth2/            # OAuth2 소셜 로그인
│   │   │       ├── exception/             # 예외 처리
│   │   │       └── util/
│   │   └── resources/
│   │       └── application.yaml
│   └── frontend/                          # React 프론트엔드
│       └── src/
│           ├── App.js                     # 라우팅
│           ├── api.js                     # Axios 인스턴스 (JWT 인터셉터)
│           ├── setupProxy.js              # 개발 서버 프록시
│           └── user/                      # 페이지 컴포넌트
├── uploads/                               # 업로드 파일 저장소
├── env.properties.example                 # 환경 변수 예시
├── build.gradle
└── deploy.sh
```

---

## 설치 및 실행

### 사전 요구사항

- Java 17 이상
- MySQL 8.0 이상
- Node.js 18 이상

---

### 1단계: 저장소 클론

```bash
git clone https://github.com/<your-username>/unikraft.git
cd unikraft
```

---

### 2단계: 데이터베이스 준비

MySQL에 접속하여 데이터베이스를 생성합니다.

```sql
CREATE DATABASE unikraft
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

---

### 3단계: 환경 변수 설정

프로젝트 루트에 `env.properties` 파일을 생성합니다.

```bash
cp env.properties.example env.properties
```

`env.properties` 파일을 열어 아래 값을 입력합니다. (상세 내용은 [환경 변수 설정](#환경-변수-설정) 참고)

---

### 4단계: 백엔드 실행

```bash
# 프로젝트 루트에서 실행
./gradlew bootRun

# Windows 환경
gradlew.bat bootRun
```

Spring Boot 서버가 `http://localhost:8080`에서 시작됩니다.

> **첫 실행 시**: `application.yaml`의 `ddl-auto: create` 설정으로 테이블이 자동 생성됩니다.
> 재실행 시에는 `update` 또는 `validate`로 변경하는 것을 권장합니다.

---

### 5단계: 프론트엔드 실행

```bash
cd src/frontend
npm install
npm start
```

React 개발 서버가 `http://localhost:3000`에서 시작됩니다.
백엔드 API 요청은 `setupProxy.js`를 통해 자동으로 `localhost:8080`으로 프록시됩니다.

---

## 환경 변수 설정

`env.properties` 파일에 다음 값을 설정합니다.

```properties
# 데이터베이스
DB_PASSWORD=your_mysql_password

# JWT 비밀키 (Base64 인코딩된 값, 최소 32자 이상 권장)
# 생성 방법: echo -n "your-secret-key-minimum-32-chars" | base64
JWT_SECRET=your_base64_encoded_secret_key

# Google OAuth2
# https://console.cloud.google.com 에서 발급
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth2
# https://developers.kakao.com 에서 발급
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# Toss Payments
# https://developers.tosspayments.com 에서 발급
TOSS_CLIENT_KEY=test_ck_your_toss_client_key
TOSS_SECRET_KEY=test_sk_your_toss_secret_key
```

### JWT 비밀키 생성 방법

```bash
# Linux / macOS
echo -n "your-secret-key-minimum-32-characters" | base64

# Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("your-secret-key-minimum-32-characters"))
```

### Google OAuth2 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성 → **API 및 서비스** → **사용자 인증 정보** → **OAuth 2.0 클라이언트 ID** 생성
3. 애플리케이션 유형: **웹 애플리케이션**
4. 승인된 리디렉션 URI 추가:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
5. 클라이언트 ID와 비밀 키를 `env.properties`에 입력

### Kakao OAuth2 설정

1. [Kakao Developers](https://developers.kakao.com) 접속 후 앱 생성
2. **플랫폼** → **Web** 플랫폼 등록: `http://localhost:3000`
3. **카카오 로그인** 활성화 → **Redirect URI** 등록:
   ```
   http://localhost:8080/login/oauth2/code/kakao
   ```
4. **동의항목**: 닉네임, 이메일, 프로필 사진 설정
5. REST API 키를 `KAKAO_CLIENT_ID`에 입력

---

## API 엔드포인트

### 사용자 (User)

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/api/user/join` | 회원가입 | 불필요 |
| POST | `/api/user/login` | 로그인 | 불필요 |
| GET | `/api/user/check-id/{loginId}` | 아이디 중복 확인 | 불필요 |
| POST | `/api/user/find-id` | 아이디 찾기 | 불필요 |
| POST | `/api/user/find-pw` | 비밀번호 찾기 | 불필요 |
| GET | `/api/user/profile/{userId}` | 프로필 조회 | 불필요 |
| PUT | `/api/user/profile/{userId}` | 프로필 수정 | JWT 필요 |
| GET | `/api/user/masters` | 장인 목록 | 불필요 |
| GET | `/api/user/master/{userId}` | 장인 상세 | 불필요 |

### 상품 (Product)

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/api/product/main` | 메인 추천 상품 | 불필요 |
| GET | `/api/product/category/{id}` | 카테고리별 상품 | 불필요 |
| GET | `/api/product/{id}` | 상품 상세 | 불필요 |
| POST | `/api/product` | 상품 등록 | JWT 필요 (장인) |
| PUT | `/api/product/{id}` | 상품 수정 | JWT 필요 (본인) |
| DELETE | `/api/product/{id}` | 상품 삭제 | JWT 필요 (본인) |

### 장바구니 (Cart)

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| GET | `/api/cart` | 장바구니 조회 | JWT 필요 |
| POST | `/api/cart` | 상품 추가 | JWT 필요 |
| DELETE | `/api/cart/{id}` | 상품 제거 | JWT 필요 |

### 주문 (Order)

| Method | URL | 설명 | 인증 |
|--------|-----|------|------|
| POST | `/api/order` | 주문 생성 | JWT 필요 |
| GET | `/api/order/my` | 내 주문 목록 | JWT 필요 |
| GET | `/api/order/{id}` | 주문 상세 | JWT 필요 |
| PATCH | `/api/order/{id}/cancel` | 주문 취소 | JWT 필요 |
| GET | `/api/order/admin/all` | 전체 주문 (관리자) | JWT 필요 (관리자) |

### 결제 (Payment)

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/payment/confirm` | Toss Payments 결제 확인 |

### 파일 업로드

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/upload/product` | 상품 이미지 업로드 |
| POST | `/api/upload/user` | 프로필 이미지 업로드 |

---

## 에러 처리

### 자주 발생하는 에러

#### 1. 데이터베이스 연결 실패

```
com.mysql.cj.jdbc.exceptions.CommunicationsException: Communications link failure
```

**원인**: MySQL 서버가 실행되지 않았거나 연결 정보가 잘못됨

**해결 방법**:
```bash
# MySQL 서버 상태 확인
# Windows
net start MySQL80

# Linux / macOS
sudo systemctl start mysql

# application.yaml 연결 정보 확인
spring.datasource.url: jdbc:mysql://localhost:3306/unikraft
spring.datasource.username: root
spring.datasource.password: ${DB_PASSWORD}
```

---

#### 2. env.properties 파일 없음

```
Could not resolve placeholder 'DB_PASSWORD' in value "${DB_PASSWORD}"
```

**원인**: 환경 변수 파일이 없거나 경로가 잘못됨

**해결 방법**:
```bash
# 프로젝트 루트에 env.properties 파일 생성
cp env.properties.example env.properties
# 파일 내용에 실제 값 입력
```

---

#### 3. JWT 서명 오류

```
io.jsonwebtoken.security.SignatureException: JWT signature does not match
```

**원인**: `JWT_SECRET` 값이 변경되었거나 Base64 형식이 올바르지 않음

**해결 방법**:
```bash
# 새 Base64 비밀키 생성 (32자 이상)
echo -n "your-new-secret-key-minimum-32-chars" | base64
# 생성된 값을 env.properties의 JWT_SECRET에 입력
```

---

#### 4. OAuth2 리디렉션 URI 불일치

```
Error 400: redirect_uri_mismatch
```

**원인**: Google / Kakao 개발자 콘솔에 등록된 Redirect URI와 실제 URI가 다름

**해결 방법**:
- Google Console → OAuth 클라이언트 → 승인된 리디렉션 URI에 추가:
  ```
  http://localhost:8080/login/oauth2/code/google
  ```
- Kakao Developers → 내 애플리케이션 → 카카오 로그인 → Redirect URI에 추가:
  ```
  http://localhost:8080/login/oauth2/code/kakao
  ```

---

#### 5. 프론트엔드 CORS 오류

```
Access to XMLHttpRequest at 'http://localhost:8080' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**원인**: 백엔드 서버가 실행되지 않았거나 CORS 설정 오류

**해결 방법**:
1. 백엔드 서버(`http://localhost:8080`)가 실행 중인지 확인
2. `src/frontend/src/setupProxy.js`에서 프록시 대상 URL 확인:
   ```js
   const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8080';
   ```

---

## 라이선스

이 프로젝트는 개인/교육 목적으로 제작되었습니다.
