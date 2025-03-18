# Loco 팀 프로젝트
---

## 📖 프로젝트 개요

### 🏷 프로젝트명
> AroundMe

### 🗓 개발 기간
> 2025.01.31 ~ 2025.02.23

### 🎯 프로젝트 목적
- 다양한 관심사를 가진 사람들이 지역별로 모임을 만들고 참여할 수 있는 커뮤니티 플랫폼으로,  
지역 사회 활성화와 친목 도모, 경험 쌓기를 지원하며, 안전한 중고거래 서비스도 제공합니다.

### 🚀 프로젝트 목표
- React, SpringBoot 및 Oracle Database를 사용하여 각 기술의 구조와 연동 방법을 심도 있게 이해하여 실무 역량을 향상시키고, 팀원들과 효과적으로 소통하며 원활한 협업 개발을 목표로 함

### 🛠 개발 환경
| 분야 | 기술 스택 |
|------|----------|
| **개발 OS** | Windows 10 |
| **Front-End** | React, Vite, JavaScript, HTML5, CSS3, Axios |
| **Back-End** | Spring Boot, JAVA |
| **DB 서버** | Oracle Database 21c |
| **JDK 버전** | JDK 17.0.13 |
| **WAS** | Apache Tomcat 9.0.97 |
| **문서화** | Google Docs(Doc, Spreadsheet, Presentation) |
| **형상관리** | GitHub |
| **개발Tool** | Visual Studio Code, Spring Tool Suite 4.27.0, SQL Developer 20.4.0.379 |
| **API** | Kakao login, Toss Payment, Google Maps, Daum Postcode, JavaMailSender |

---

## 👥 역할 분담
| 역할 | 담당자 | 설명 |
|------|--------|------|
| 팀장 | 👤 장표 | - 프론트엔드 파일구조 설계<br>- 전체 레이아웃 디자인<br>- 컴포넌트 구조 설계<br>- 메인 홈페이지 구현<br>- 관리자 로그인페이지 구현<br>- 로고 제작<br>- 채팅기능구현<br>- 필터 검색 기능 구현<br>- 이메일/비밀번호 찾기 기능 구현 |
| 부팀장 | 👤 전지연 | - 백엔드 파일 구조 설계<br>- DB 테이블 설계<br>- 리액트(프론트) & 스프링부트(백엔드) & 오라클(DB) 연결<br>- 회원가입, 로그인, 탈퇴 기능 디자인과 구현<br>- 보안<br>- 토큰(엑세스, 리프레시) 구현<br>- 마이페이지 디자인<br>- 마이페이지 내가 쓴 댓글 구현 |
| 팀원 | 👤 나종호 | - 모임생성 및 수정, 삭제 기능<br>- 모임페이지 구현 및 디자인<br>- 관리자 모임관리 페이지 구현<br>- 날짜로 페이지네이션 기능<br>- 좋아요(관심) 기능 구현<br>- 마이페이지 관심 및 참여 확인 기능 구현 |
| 팀원 | 👤 권민성 | - 상품 등록 및 수정, 삭제 기능<br>- 토스페이 결제 기능 구현<br>- 마켓페이지 디자인<br>- 상품 검색 및 카테고리 필터 기능 구현<br>- 마이페이지 상품 및 결제내역 확인 기능 구현<br>- 관리자페이지 상품 및 결제내역 확인 기능 구현 |
| 팀원 | 👤 김연아 | - 게시판 및 댓글 등록, 수정, 삭제 기능<br>- 게시판 디자인<br>- 관리자 게시판, 댓글페이지 구현<br>- 마이페이지 게시판 게시글페이지 구현<br>- 게시글 제목, 작성자 기준 검색 기능 구현 |

---

## 📊 데이터 모델링
### 🔗 ERD  
<p align="center">
<img width="90%" src="https://github.com/user-attachments/assets/6cc36970-6172-4065-bd1a-972483a3684b">

---

## 💻 실행 화면(YouTube Linked)

### [![YouTube Video](https://img.youtube.com/vi/2CA6hVGyeoo/0.jpg)](https://youtu.be/2CA6hVGyeoo)

---

## 🔒 보안
- 🔹 인증/인가 (JWT, Spring Security)
- 🔹 JWT 만료 정책
  -  AccessToken: 6시간
  -  RefreshToken: 7일
- 🔹 보안 강화 기능
  -  RefreshToken DB 또는 localStorage 저장
  -  Spring Security 기반 인가
  -  CSRF 방어 및 API 보안 강화

---




