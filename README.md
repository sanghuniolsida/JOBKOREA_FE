# 알바몬 검색조건설정 모바일UI 분석 및 솔루션 도출 페이지

📎 [ChatGPT 프롬프팅 링크 & 캡처](https://chatgpt.com/share/68aac989-a168-8010-9064-4782bb8cf2f8)

모바일 웹 환경에서 **검색 조건 설정 UI**를 분석하고, 사용자 친화적 인터페이스로 리디자인 및 구현한 프로젝트입니다.  

---

## 🚀 실행 방법

```bash
npm install
bash
복사
편집
npm run dev
🛠️ 기술 스택
React 18 (함수형 컴포넌트, 훅 기반)

TypeScript

Vite (개발 환경)

TailwindCSS (UI 스타일링)

📂 폴더 구조
arduino
복사
편집
project-root/
  src/              # 실제 코드 (React, TypeScript)
    components/
    pages/
  docs/             # 문서/스크린샷/설명 자료
    images/
      workdays1.png
      workdays2.png
      workhours.png
      accordion.png
  .cursor/
    rules
  README.md
  package.json
  vite.config.ts
👩‍💻 주요 기능 (Usage Example)
1. 근무 요일 선택
주 2일, 주 3일 등을 선택하면 선호 요일 직접 선택 가능

선택된 요일은 하단 CTA 버튼으로 전달

<div align="center"> <img src="docs/images/workdays1.png" alt="workdays1" width="45%" /> <img src="docs/images/workdays2.png" alt="workdays2" width="45%" /> </div>
2. 근무 시간대 다중 선택
원하는 시간대 여러 개 등록 가능

시작/종료 시간 지정 후 추가하기 버튼 클릭

<img src="docs/images/workhours.png" alt="workhours" width="600" />
3. 추가 조건 (아코디언)
성별, 연령 등 부가 조건은 아코디언 영역에 배치

기본 화면에서는 숨기고, 필요 시 확장 가능

<img width="251" height="563" alt="Image" src="https://github.com/user-attachments/assets/b9d6bd52-ba41-4e89-be18-016cd8f10d16" />
📌 커밋 규칙
Conventional Commits 규칙을 따릅니다.

feat: 새로운 기능

fix: 버그 수정

refactor: 리팩토링

style: 스타일/디자인 변경 (로직 없음)

docs: 문서 수정

chore: 빌드/환경설정

test: 테스트 코드
