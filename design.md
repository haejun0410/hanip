# HanIP (한입) Design System

## 앱 개요
**한입** - 정부 혜택·절세 정보 통합 제공 모바일 앱  
사용자의 가족 관계, 소득, 자산 정보를 기반으로 맞춤형 공제·지원금 정보를 추천

---

## 색상 시스템 (Color System)

```css
/* Primary */
--primary: #3B6FE8         /* 메인 블루 - 버튼, 활성 상태, 강조 */
--primary-light: #EBF1FF   /* 연한 블루 - 카드 배경, 뱃지 */
--primary-dark: #2952C4    /* 진한 블루 - hover, pressed */

/* Background */
--bg-default: #F5F7FF      /* 페이지 기본 배경 */
--bg-white: #FFFFFF        /* 카드, 컴포넌트 배경 */
--bg-gray: #F3F4F6         /* 구분 섹션 배경 */

/* Text */
--text-primary: #1A1A2E    /* 주요 텍스트 */
--text-secondary: #6B7280  /* 보조 텍스트 */
--text-tertiary: #9CA3AF   /* 힌트, 비활성 텍스트 */
--text-white: #FFFFFF

/* Semantic */
--success: #10B981         /* 초록 - 성공, 신청가능 */
--warning: #F59E0B         /* 주황 - 경고, D-day */
--error: #EF4444           /* 빨강 - 오류 */
--purple: #7C3AED          /* 보라 - AI, 챗봇 */

/* Border */
--border: #E5E7EB          /* 기본 테두리 */
--border-light: #F0F0F0    /* 연한 테두리 */

/* Tag Colors */
--tag-blue: #3B6FE8        /* 교육 태그 */
--tag-green: #10B981       /* 생활 태그 */
--tag-orange: #F59E0B      /* 취업 태그 */
--tag-purple: #8B5CF6      /* 주거 태그 */
```

---

## 타이포그래피 (Typography)

```
Font Family: "Apple SD Gothic Neo", "Noto Sans KR", sans-serif

/* Heading */
h1: 24px / Bold / line-height 1.3
h2: 20px / Bold / line-height 1.3
h3: 18px / SemiBold / line-height 1.4
h4: 16px / SemiBold / line-height 1.4

/* Body */
body1: 15px / Regular / line-height 1.6
body2: 14px / Regular / line-height 1.6
caption: 12px / Regular / line-height 1.5

/* Special */
amount: 28-32px / Bold (금액 표시)
badge: 11px / SemiBold
```

---

## 모바일 프레임 (Mobile Frame)

```
Max Width: 390px
Min Height: 844px (iPhone 14 Pro 기준)
Safe Area: 상단 44px, 하단 34px (notch/home indicator)
```

---

## 컴포넌트 시스템 (Components)

### Bottom Navigation
5개 탭 고정 하단 네비게이션:
| 탭 | 아이콘 | 경로 |
|---|---|---|
| 홈 | 🏠 house | `/` |
| 절세추천 | ⭐ star/sparkle | `/recommend` |
| AI 도우미 | 💬 chat (중앙, 크고 파란 원형) | `/chatbot` |
| 정책 | 📋 document | `/policy` |
| 마이페이지 | 👤 person | `/mypage` |

- 활성 탭: Primary Blue (#3B6FE8) 색상
- 비활성 탭: Gray (#9CA3AF)
- 중앙 챗봇 버튼: 파란 원형 배경, 흰색 아이콘, 살짝 위로 올라옴

### Header
- 좌: 뒤로가기 아이콘 (상세 페이지) 또는 "한입" 로고
- 중앙: 페이지 타이틀
- 우: 알림 벨 아이콘 (배지 포함)

### Card
- border-radius: 16px
- box-shadow: 0 2px 8px rgba(0,0,0,0.06)
- padding: 16px
- background: white

### Button (Primary)
- background: #3B6FE8
- color: white
- border-radius: 12px
- height: 52px
- font-size: 16px / SemiBold
- width: 100% (기본 full-width)

### Badge / Tag
- border-radius: 20px
- padding: 4px 10px
- font-size: 12px
- background: category color + 20% opacity

---

## 페이지별 구조 (Pages)

### 1. 로그인 / 온보딩 (LoginFlow)
**경로:** `/login`  
**단계 (8단계):**
1. 본인 인증 & 바이오메트릭 연결
2. 가족 관계 입력 (가구원 수, 관계 선택)
3. 소득 정보 입력 (연 소득 금액)
4. 주식 정보 입력
5. 로딩 중 (AI 분석 중)
6. 혜택 환영 완료 (128만원)
7. AI 분석 완료 메시지
8. 기업 공모 홍보 샷

**특징:**
- 상단 스텝 프로그레스 바
- 각 단계 파란 일러스트 아이콘
- 하단 CTA 버튼 고정

### 2. 홈 (HomePage)
**경로:** `/`  
**섹션:**
- 배너: 놓친 공제 헤택 (120만원) + CTA 버튼
- 빠른 실행: 일일세천 신청, 일반 세금 계산 CTA 4개 아이콘
- 추천 공제: 안경/렌즈 10만원 (슬라이드 카드)
- 캘린더: 2025년 5월 (신청 기간 표시)
- 알림: 정부 지원 정보 카드 리스트

**특징:**
- 상단 알림 배너 (노란 배경)
- 금액 표시: 빨간/초록 색상 구분
- 달력 내 마감일 하이라이트

### 3. 절세 추천 (RecommendPage)
**경로:** `/recommend`  
**구조:**
- 헤더: "절세 추천 - 지금 받을 수 있는 혜택을 찾아보세요"
- 2열 그리드 카드: 안경/렌즈 10만, 마이스터고 지녀교비 30만, 건강검진 15만, 월세 세액공제 75만, 신용카드 최대 30만, 출산/육아 20만
- 하단: "더 많은 지원금 찾기" 배너

**특징:**
- 카드: 아이콘 이미지 + 금액 + 해시태그 태그

### 4. 절세 추천 상세 (RecommendDetailPage)
**경로:** `/recommend/:id`  
**구조:**
- 백 버튼 헤더 + 카테고리 배지 "의료비 공제"
- 타이틀: 안경/렌즈
- 올해 현황 금액 카드 (파란 배경)
- 공제 대상 섹션
- 공제 조건 체크리스트
- 신청 절차 (단계별)
- 하단: 영수증 등록하기 / 판매장 미리보기 버튼

### 5. AI 챗봇 초기화 (ChatbotInitPage)
**경로:** `/chatbot/init`  
**구조:**
- 타이틀: "나에게 딱 맞는 AI 코치를 선택해주세요"
- 3개 캐릭터 카드 (곰, 펭귄, 부엉이):
  - 이모 모르는 사람 (유리사 중) - 노란 곰
  - 들이는 방전탄 사람 (행랑 수준) - 파란 펭귄
  - 딱만의 정보 알고싶은 사람 (실력 수준) - 갈색 부엉이
- 하단: 선택하고 시작하기 버튼

### 6. AI 챗봇 (ChatbotPage)
**경로:** `/chatbot`  
**구조:**
- 헤더: "AI 도우미" + 우측 아이콘 3개
- 사용자 정보 카드: 34세·1인 가구, 연 소득 2,400~5,000만원
- AI 말풍선: 인사 메시지
- 빠른 답변 버튼 리스트 (아코디언)
- 하단: 텍스트 입력창 + 전송 버튼

### 7. 정책 (PolicyPage)
**경로:** `/policy`  
**구조:**
- 헤더: "정책" + 검색창
- 카테고리 탭: 전체 / 교육 / 주거 / 취업·창업 / 생활·복지 / 대출
- 추천 정책 (가로 스크롤 카드): 국가장학금, 한부모가족 한부모양육비, 청년전기
- 전체 정책 리스트 (카드형)

### 8. 정책 상세 (PolicyDetailPage)
**경로:** `/policy/:id`  
**구조:**
- 카테고리 배지 + 타이틀 (국가장학금 지원)
- 탭: 정책 정보 / 신청하기
- 정보 섹션: 신청 기간, 지원 대상, 지원 금액, 소득 기준
- 신청 절차 스텝 (단계별 화살표)
- 자세히 보기 링크

### 9. 마이페이지 (MyPage)
**경로:** `/mypage`  
**구조:**
- 프로필: 아바타 + 이름 + 레벨 (뱃지)
- 총 절약 금액 카드: 1,236,000원 + 세부 내역
- 빠른 메뉴 (4개 아이콘): 신청 내역, 일일 알림, AI 챙겨 기기, 편집 편집
- 나의 혜택 요약 (3개 항목)
- 챗봇 CTA 배너
- 설정 및 정보 리스트

### 10. 알림 (NoticePage)
**경로:** `/notice`  
**구조:**
- 헤더: 알림
- 탭: 전체 / 혜택 추천 / 신청/처리 현황 / 일반 알림
- 혜택 추천 알림 카드 (이미지 + 제목 + 부제목 + CTA)
- 신청/처리 현황 카드
- 일반 알림 리스트

---

## 아이콘 시스템

SVG 인라인 방식 사용. lucide-react 라이브러리 활용:
- Home, Star, MessageCircle, FileText, User (Bottom Nav)
- Bell, ChevronRight, ChevronLeft (Header)
- Check, Calendar, Search, Settings (페이지별)

---

## 애니메이션 / 인터랙션

- Page transition: 슬라이드 (좌→우 push)
- Tab switch: fade
- Button press: scale(0.97) + 0.1s
- Card hover: shadow 증가
- Loading: 스피너 (파란색)

---

## 이미지 에셋

- `/logo.png` : 앱 로고 (상단 헤더, 온보딩 화면)
- `sample/` : 디자인 레퍼런스 스냅샷
  - login_process.png
  - main_page.png
  - recommend.png
  - recommend_detail.png
  - chatbot_init.png
  - chatbot.png
  - policy.png
  - policy_detail.png
  - mypage.png
  - notice.png
