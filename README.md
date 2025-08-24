# 알바몬 검색조건설정 모바일UI 리디자인

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</div>


## CHAT GPT 프롬프팅 링크 및 GEN AI 프롬프팅 캡처 사진

[CHAT GPT 프롬프팅 링크]https://chatgpt.com/share/68aac989-a168-8010-9064-4782bb8cf2f8
[커서AI 프롬프팅](docs/ui-guidelines.md)


<div align="center">
  <img src="https://github.com/user-attachments/assets/34ba7f65-464a-4d72-bee5-6ca63f8963e9" width="30%" />
  <img src="https://github.com/user-attachments/assets/6d573f02-7936-4823-b0b7-04fc6c28cf3a" width="30%" />
  <img src="https://github.com/user-attachments/assets/241c884e-e140-4252-900f-c74fde6b5617" width="30%" />
</div>

---
## 📋 프로젝트 개요

모바일 웹 환경에서 **검색 조건 설정 UI**를 분석하고, 사용자 친화적 인터페이스로 리디자인 및 구현한 프로젝트입니다.

기존 알바몬 모바일 앱의 복잡한 검색 조건 설정 과정을 개선하여, 직관적이고 효율적인 사용자 경험을 제공합니다.

### 🎯 주요 개선 사항
- 복잡한 검색 옵션을 단계별로 분리하여 인지 부하 감소
- 자주 사용하는 조건은 상단에, 부가 조건은 아코디언으로 구성
- 시각적 피드백과 직관적인 인터랙션 제공

---

## 🛠️ 기술 스택

| 분야 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **프레임워크** | React | 18+ | UI 라이브러리 |
| **언어** | TypeScript | 5+ | 타입 안정성 |
| **빌드툴** | Vite | 5+ | 개발 환경 |
| **스타일링** | TailwindCSS | 3+ | 유틸리티 CSS |

<br>

## 📂 프로젝트 구조
```
project-root/
├── src/                    # 소스 코드
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   └── Header
|       └── Footer
|       └── FilterComponents
│   ├── pages/             # 페이지 컴포넌트
|   └── search/            # 검색 관련 컴포넌트
│   ├── types/             # TypeScript 타입 정의
│ 
├── docs/                  # 문서 및 이미지
│   └── images/           # 스크린샷
├── public/               # 정적 파일
└── package.json
```

## ✨ 주요 기능

### 1. 📅 근무 요일 선택
- **스마트 선택**: 주 2일, 주 3일 등을 선택하면 구체적인 요일 선택 가능
- **시각적 피드백**: 선택된 요일은 색상으로 구분하여 표시
- **유연한 조합**: 여러 요일 조합 선택 지원

<div align="center">
  <img width="250" height="564" alt="Image" src="https://github.com/user-attachments/assets/ab912c63-0630-4990-9432-d02575da1d62" />
  <img width="250" height="566" alt="Image" src="https://github.com/user-attachments/assets/d8af12b1-7997-4df5-8d10-3057d6ce6d83" />
</div>

### 2. ⏰ 근무 시간대 다중 선택
- **다중 시간대 등록**: 원하는 시간대 여러 개 동시 관리
- **직관적 입력**: 시작/종료 시간을 쉽게 지정

<div align="center">
<img width="250" height="562" alt="Image" src="https://github.com/user-attachments/assets/b3f6d94c-8ffa-4dec-aaa2-5e6ddda08008" />
</div>

### 3. 📋 추가 조건 (아코디언)
- **공간 효율성**: 부가 조건들을 아코디언으로 숨김/표시
- **단계적 접근**: 필요에 따라 상세 조건 설정 가능
- **깔끔한 UI**: 기본 화면의 복잡도를 최소화

<div align="center">
<img width="250" height="562" alt="Image" src="https://github.com/user-attachments/assets/d4c4678f-9d3d-4cf8-b64f-5a1e50d166b5" />
</div>

---

## 🎨 UX/UI 개선사항

### Before vs After
| 구분 | 기존 | 개선 후 |
|------|------|---------|
| **레이아웃** | 스크롤 옵션을 최소화한 화면 | 우선순위에 따른 단계적 구성 |
| **인터랙션** | 정적인 체크박스/드롭다운 | 동적이고 직관적인 선택 방식 |

---

## 🔧 개발 가이드

### 스타일링 컨벤션
- **Tailwind 유틸리티 클래스** 우선 사용

---

### 타입별 예시
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 기능 변경 없는 코드 리팩토링
- `style`: 코드 포매팅, 세미콜론 누락 등
- `docs`: 문서 수정
- `test`: 테스트 코드 추가/수정
- `chore`: 빌드 과정이나 보조 도구 변경

---

## 🔗 참고 자료

- **원본 알바몬 앱**: [알바몬 모바일 웹](https://www.albamon.com)
- **디자인 시스템**: [Tailwind CSS 문서](https://tailwindcss.com/docs)

