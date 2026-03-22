# Chronote

AI 기반 실시간 그룹 채팅 매칭 서비스.  
사용자의 관심사를 분석해 유사한 주제의 채팅방에 자동 매칭하거나, 새 채팅방을 생성합니다.

---

<details open>
  <summary><b>Why Chronote? (왜 이 서비스를 만들었는가)</b></summary>

기존 채팅 서비스는 사용자가 **직접 방을 찾거나 만들어야** 하는 불편함이 있습니다.

- **적합한 방을 찾기 어려움**: 수많은 채팅방 중 자신의 관심사와 맞는 방을 직접 탐색해야 합니다.
- **중복 채팅방 생성**: 같은 주제의 방이 여럿 생겨 커뮤니티가 분산됩니다.
- **콜드 스타트 문제**: 새 사용자가 어떤 방에 들어가야 할지 알기 어렵습니다.

Chronote는 이 문제를 해결합니다.  
사용자가 **관심 주제를 입력**하면 AI가 기존 채팅방과 **의미적 유사도를 분석**해 가장 적합한 방에 자동으로 매칭하고, 적합한 방이 없으면 새 채팅방을 자동 생성합니다.

</details>

---

<details open>
  <summary><b>Architecture</b></summary>

```
[React Client :3000]
       │ HTTP / WebSocket
       ▼
[Spring Boot Server :8080]
  ├── REST API (인증/채팅/매칭)
  ├── WebSocket (실시간 채팅)
  ├── MySQL (유저/채팅 데이터)
  └── MongoDB (채팅 메시지)
       │ HTTP
       ▼
[FastAPI PyServer :8000]
  ├── AI 매칭 (한국어 임베딩)
  └── OpenAI API (LLM)
```

- **Client (React)**: 채팅 UI, 매칭 요청, 실시간 메시지
- **API Server (Spring Boot)**: 인증/권한, 채팅방 관리, 매칭 오케스트레이션
- **PyServer (FastAPI)**: 한국어 임베딩 기반 채팅방 유사도 매칭
- **MySQL**: 유저, 채팅방, Todo 데이터
- **MongoDB**: 실시간 채팅 메시지

</details>

---

<details open>
  <summary><b>Badges</b></summary>

![Java](https://img.shields.io/badge/Java-17-007396?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-6DB33F?logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring%20Security-JWT-6DB33F?logo=springsecurity&logoColor=white)
![JPA](https://img.shields.io/badge/Spring%20Data%20JPA-ORM-6DB33F?logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-build-02303A?logo=gradle&logoColor=white)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios&logoColor=white)
![STOMP](https://img.shields.io/badge/STOMP-WebSocket-010101?logo=socket.io&logoColor=white)

![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-AI%20Server-009688?logo=fastapi&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-gpt--4.1--mini-000000?logo=openai&logoColor=white)

![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-repo-181717?logo=github&logoColor=white)

</details>

---

<details open>
  <summary><b>Tech Stack & Why (왜 이 기술을 쓰는가)</b></summary>

### Client (React)

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="36" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="36" alt="JavaScript" />
</p>

- **React**
  - 컴포넌트 기반으로 채팅/매칭/대시보드 UI를 빠르게 구성
  - 실시간 메시지 상태 관리에 적합
- **STOMP + SockJS**
  - WebSocket 기반 실시간 채팅 구현
  - Spring과의 연동이 안정적
- **Axios**
  - JWT 헤더 처리, 에러 공통 처리 등 API 호출 일관성 확보

---

### API Server (Spring Boot)

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="36" alt="Java" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" height="36" alt="Spring" />
</p>

- **Spring Boot 4.0**
  - REST API + WebSocket을 하나의 서버에서 처리
  - 자동설정으로 빠른 개발 시작
- **Spring Security + JWT**
  - Stateless 인증으로 React와 분리된 로그인 흐름 구성
  - 채팅/매칭 데이터 보호
- **Spring Data JPA + MySQL**
  - 유저, 채팅방, Todo 같은 정형 데이터 관리
- **Spring Data MongoDB**
  - 채팅 메시지처럼 빠르게 쌓이는 비정형 데이터에 적합

---

### AI Matching Server (FastAPI)

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" height="36" alt="Python" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" height="36" alt="FastAPI" />
</p>

- **FastAPI**
  - AI 파이프라인을 API 서버와 역할 분리
  - 비동기 처리로 임베딩 연산 부하 분산
- **ko-sroberta-multitask (한국어 임베딩)**
  - 채팅방 제목과 사용자 입력의 의미적 유사도 계산
  - 한국어 특화 모델로 매칭 품질 확보
- **OpenAI gpt-4.1-mini**
  - 채팅방 자동 제목 생성, 피드백 기능

---

### Database

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="36" alt="MySQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="36" alt="MongoDB" />
</p>

- **MySQL**: 유저/채팅방/Todo 등 관계형 데이터
- **MongoDB**: 실시간 채팅 메시지 저장 (빠른 쓰기/읽기)

---

### Infra

<p>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" height="36" alt="Docker" />
</p>

- **Docker Compose**
  - MySQL, MongoDB, Spring, FastAPI, React를 하나의 명령으로 실행
  - 개발/운영 환경 일치 보장

</details>

---

<details open>
  <summary><b>Project Structure</b></summary>

<pre><code>chronote/
  docker-compose.dev.yml  # 전체 서비스 실행
  .env                    # 환경변수 (gitignore)
  server/                 # Spring Boot API 서버
    src/
      main/java/com/chronote/
        config/           # Security, CORS 설정
        controller/       # REST API 컨트롤러
        service/          # 비즈니스 로직
        repository/       # JPA / MongoDB 레포지토리
        entity/           # 도메인 엔티티
        security/         # JWT 필터
    Dockerfile
  pyserver/               # FastAPI AI 서버
    main.py
    requirements.txt
    .env                  # (gitignore)
    Dockerfile
  client/                 # React 클라이언트
    src/
      pages/
      components/
    Dockerfile
</code></pre>

</details>

---

<details open>
  <summary><b>Getting Started</b></summary>

### 사전 준비

- Docker Desktop 설치
- 루트에 `.env` 파일 생성:

```env
DB_PASSWORD=yourpassword
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
```

- `pyserver/.env` 파일 생성:

```env
OPENAI_API_KEY=sk-...
```

### 실행

```bash
docker compose -f docker-compose.dev.yml up --build
```

</details>