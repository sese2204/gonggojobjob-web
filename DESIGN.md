# 공고줍줍 Design System

> AI 맞춤 채용공고 검색 플랫폼의 디자인 시스템.
> 새로운 페이지나 컴포넌트를 만들 때 이 문서를 참고하여 일관된 UI를 유지합니다.

---

## Visual Theme & Atmosphere

- **톤**: 깔끔하고 신뢰감 있는 SaaS 스타일. 불필요한 장식 없이 콘텐츠에 집중.
- **배경**: 밝은 회색(`gray-50`) 위에 흰색 카드를 띄우는 레이어 구조.
- **느낌**: 친근하면서도 프로페셔널. 한국어 UI에 최적화된 간격과 타이포그래피.

---

## Color Palette

### Brand / Primary

| Token | Tailwind | Hex | 용도 |
|-------|----------|-----|------|
| Primary | `blue-600` | `#2563EB` | CTA 버튼, 로고, 링크, 포커스 링 |
| Primary Hover | `blue-700` | `#1D4ED8` | 버튼 hover 상태 |
| Primary Soft | `blue-50` | `#EFF6FF` | 선택된 상태 배경, 뱃지 |
| Primary Text | `blue-600` / `blue-700` | — | 강조 텍스트, 링크 |

### Neutral (Grayscale)

| Token | Tailwind | 용도 |
|-------|----------|------|
| Background | `gray-50` | 페이지 배경 |
| Surface | `white` | 카드, 모달, 입력 필드 배경 |
| Border Light | `gray-100` | 카드 테두리, 구분선 |
| Border Default | `gray-200` | 입력 필드 테두리 |
| Text Primary | `gray-900` | 제목, 핵심 정보 |
| Text Secondary | `gray-700` | 본문 텍스트 |
| Text Tertiary | `gray-500` | 보조 텍스트, 플레이스홀더 |
| Text Muted | `gray-400` | 가장 약한 텍스트, 힌트 |
| Dark Surface | `gray-900` | 로그인 버튼 배경 |

### Status Colors (북마크 상태)

| 상태 | Background | Text | 라벨 |
|------|-----------|------|------|
| 미지원 | `gray-100` | `gray-700` | 미지원 |
| 지원완료 | `blue-50` | `blue-700` | 지원완료 |
| 면접 진행 | `yellow-50` | `yellow-700` | 면접 진행 |
| 불합격 | `red-50` | `red-700` | 불합격 |
| 합격 | `green-50` | `green-700` | 합격 |

### Semantic Colors

| Token | Tailwind | 용도 |
|-------|----------|------|
| Error BG | `red-50` | 에러 메시지 배경 |
| Error Text | `red-600` | 에러 텍스트, 삭제 버튼 |
| Success BG | `green-50` | 성공 상태 배경 |
| Success Text | `green-700` | 성공 텍스트 |
| Warning BG | `yellow-50` | 경고 배경 |
| Warning Text | `yellow-700` | 경고 텍스트 |
| Accent | `rose-500` | 응원(Cheer) 섹션 강조 |

### Decorative (Cheer Card Colors)

응원 카드에 사용되는 파스텔 조합:

```
amber-50 / amber-100, sky-50 / sky-100, rose-50 / rose-100,
emerald-50 / emerald-100, violet-50 / violet-100, orange-50 / orange-100
```

---

## Typography

### Font Stack

- **기본**: `font-sans` (시스템 폰트)
- **고정폭**: `font-mono` (계좌번호 등 숫자 정보)

### Scale

| Class | Size | Weight | 용도 |
|-------|------|--------|------|
| `text-5xl` | 48px | — | 빈 상태 이모지 |
| `text-3xl` | 30px | `font-bold` | 페이지 메인 제목 (데스크톱) |
| `text-2xl` | 24px | `font-bold` | 페이지 메인 제목 (모바일) |
| `text-xl` | 20px | `font-extrabold` | 로고, 브랜딩 |
| `text-lg` | 18px | `font-bold` | 섹션 제목, 카드 제목 |
| `text-base` | 16px | `font-medium` | 일반 본문 (드물게 사용) |
| `text-sm` | 14px | `font-medium` | 버튼, 카드 본문, 폼 라벨 |
| `text-xs` | 12px | `font-medium` | 메타 정보, 뱃지, 타임스탬프 |

### 반응형 타이포그래피

```
제목: text-2xl sm:text-3xl
부제목: text-lg sm:text-xl
```

### Letter Spacing

- `tracking-tight`: 로고/브랜딩 텍스트에 사용

---

## Spacing

### Base Unit: 4px (Tailwind default)

### Component Spacing

| 요소 | 모바일 | 데스크톱 |
|------|--------|----------|
| 카드 내부 패딩 | `p-4` | `sm:p-6` |
| 섹션 패딩 | `p-5` | `sm:p-10` |
| 버튼 패딩 | `px-4 py-2` | `px-5 py-3.5` |
| 입력 필드 | `px-4 py-2.5` | 동일 |
| 모달 패딩 | `p-6` | 동일 |
| 네비게이션 | `px-4 py-4` | `sm:px-8 py-4` |

### Gap Patterns

| 크기 | Class | 용도 |
|------|-------|------|
| 작음 | `gap-1` ~ `gap-2` | 아이콘+텍스트, 인라인 요소 |
| 중간 | `gap-3` ~ `gap-4` | 카드 내부 요소 간격 |
| 큼 | `gap-6` | 섹션 간 간격, 사이드바+콘텐츠 |

---

## Border Radius

| Class | Size | 용도 |
|-------|------|------|
| `rounded-full` | 9999px | 알약형 버튼, 프로필 이미지 |
| `rounded-2xl` | 16px | 카드, 모달, 주요 컨테이너 |
| `rounded-xl` | 12px | 버튼, 중간 크기 컴포넌트 |
| `rounded-lg` | 8px | 입력 필드, 작은 컴포넌트 |
| `rounded-md` | 6px | 뱃지, 태그 |

**규칙**: 컨테이너가 클수록 radius가 큼.

---

## Shadows & Elevation

| Level | Class | 용도 |
|-------|-------|------|
| Level 0 | 없음 | 배경, 인라인 요소 |
| Level 1 | `shadow-sm` | 카드 기본 상태 |
| Level 2 | `shadow-md` | 카드 hover, 선택된 태그 |
| Level 3 | `shadow-xl` | 모달 |

**Hover 패턴**: `shadow-sm` → hover 시 `shadow-md` (with `transition-shadow`)

---

## Component Styles

### Buttons

**Primary (CTA)**
```
bg-blue-600 hover:bg-blue-700 text-white
rounded-xl font-bold py-3 px-8
transition-colors
```

**Secondary**
```
bg-gray-100 text-gray-700
rounded-xl hover:bg-gray-200 font-medium
```

**Soft (Primary variant)**
```
bg-blue-50 text-blue-600
hover:bg-blue-100 font-medium rounded-xl
```

**Dark (로그인)**
```
bg-gray-900 text-white
rounded-full hover:bg-gray-800 font-medium
```

**Danger**
```
text-red-500 hover:text-red-600
또는 bg-red-50 text-red-600 hover:bg-red-100
```

**Disabled 상태**: `disabled:opacity-50 disabled:cursor-not-allowed`

### Cards

```
bg-white p-4 sm:p-6
rounded-2xl shadow-sm
border border-gray-100
hover:shadow-md transition-shadow
```

### Input Fields

```
w-full px-4 py-2.5
border border-gray-200 rounded-lg
text-sm
focus:ring-2 focus:ring-blue-500 focus:border-transparent
outline-none
```

### Modals

**Backdrop**
```
fixed inset-0 bg-black/50
flex items-center justify-center
z-50 p-4
```

**Container**
```
bg-white rounded-2xl p-6
max-w-md w-full shadow-xl
```

### Status Badges

```
px-2 py-1 rounded-md
text-xs font-bold
{STATUS_CONFIG[status].color}
```

### Tags (선택 가능)

**선택됨**
```
bg-blue-600 text-white shadow-md
```

**미선택**
```
bg-white text-gray-600
border border-gray-200 shadow-sm
hover:bg-gray-100
```

### Loading Spinner

```
h-12 w-12 rounded-full
border-b-2 border-blue-600
animate-spin
```

---

## Layout

### Max Widths

| Class | Size | 용도 |
|-------|------|------|
| `max-w-6xl` | 72rem | 검색 결과 그리드 |
| `max-w-4xl` | 56rem | 메인 컨테이너 |
| `max-w-3xl` | 48rem | 콘텐츠 페이지 (약관 등) |
| `max-w-md` | 28rem | 모달 |

### Responsive Patterns

**Flex Direction**
```
flex flex-col sm:flex-row
```

**Grid**
```
grid grid-cols-1 sm:grid-cols-2
```

**Show/Hide**
```
hidden lg:block  (데스크톱에서만 표시)
lg:hidden        (모바일에서만 표시)
```

### Navigation

```
flex items-center justify-between
px-4 sm:px-8 py-4
bg-white border-b border-gray-100
```

---

## Animations & Transitions

### Transitions

| Class | 용도 |
|-------|------|
| `transition-colors` | 버튼 hover, 링크 색상 변경 |
| `transition-shadow` | 카드 hover elevation 변경 |
| `transition-opacity` | 로고, 페이드 효과 |
| `transition-all` | 복합 인터랙션 |

### Animations

| Class | 용도 |
|-------|------|
| `animate-spin` | 로딩 스피너 |
| `animate-pulse` | 로딩 텍스트 깜빡임 |
| `animate-fade-in-up` | 콘텐츠 등장 (아래→위 슬라이드 + 페이드) |

### Interactive States

```
hover:scale-105    (응원 카드 등 인터랙티브 요소)
hover:opacity-80   (로고)
```

---

## Design Guardrails

### DO

- 카드 기반 레이아웃 사용 (`rounded-2xl shadow-sm border border-gray-100`)
- 모바일 우선 설계 후 `sm:`, `md:` 브레이크포인트로 확장
- 상태 색상은 `STATUS_CONFIG` 상수 참조
- 버튼에 `transition-colors` 추가
- 빈 상태에 이모지 + 안내 텍스트 제공
- `blue-600`을 Primary 액션에 일관되게 사용

### DON'T

- `shadow-lg`, `shadow-2xl` 사용 금지 (시스템에서 미사용)
- `rounded-sm`, `rounded` 단독 사용 금지 (최소 `rounded-md`)
- 커스텀 색상 Hex 하드코딩 금지 — Tailwind 팔레트 사용
- 과도한 그라데이션 사용 금지 (현재 거의 미사용)
- `text-black` 직접 사용 금지 — `text-gray-900` 사용
- 4단계 이상 깊은 중첩 색상 사용 금지

---

## AI Prompt Guide

새 페이지나 컴포넌트를 만들 때 이 프롬프트를 참고하세요:

> "이 DESIGN.md의 컬러 팔레트, 타이포그래피, 컴포넌트 스타일을 따라서
> [기능 설명] 페이지를 만들어줘. 카드는 rounded-2xl shadow-sm border-gray-100,
> 버튼은 blue-600 primary 스타일, 모바일 우선 반응형으로."
