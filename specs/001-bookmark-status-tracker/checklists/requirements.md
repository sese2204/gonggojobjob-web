# Requirements Checklist: 공고 북마크 + 지원 상태 관리

## Functional Requirements

- [ ] **FR-001**: 검색 결과 공고 북마크 (POST /api/bookmarks { jobListingId })
- [ ] **FR-002**: 추천 공고 북마크 (POST /api/bookmarks { recommendedJobId })
- [ ] **FR-003**: 커스텀 공고 추가 (POST /api/bookmarks/custom)
- [ ] **FR-004**: 북마크 목록 페이지네이션 조회 (GET /api/bookmarks)
- [ ] **FR-005**: 상태별 필터링 (GET /api/bookmarks?status=)
- [ ] **FR-006**: 지원 상태 변경 (PATCH /api/bookmarks/{id})
- [ ] **FR-007**: 메모 추가/수정/삭제 (PATCH /api/bookmarks/{id})
- [ ] **FR-008**: 북마크 삭제 (DELETE /api/bookmarks/{id})
- [ ] **FR-009**: 이미 북마크된 공고 시각적 구분 (검색/추천 카드)
- [ ] **FR-010**: 비로그인 사용자 북마크 시 로그인 유도

## UI Components

- [ ] 검색 결과 카드에 북마크 토글 버튼
- [ ] 추천 공고 카드에 북마크 토글 버튼
- [ ] "내 지원 현황" 페이지 (새 라우트: /bookmarks)
- [ ] 상태 필터 탭 (전체/미지원/지원완료/면접 진행/불합격/합격)
- [ ] 상태 변경 드롭다운 (색상 코딩)
- [ ] 메모 인라인 편집
- [ ] 커스텀 공고 추가 모달
- [ ] 삭제 확인 다이얼로그
- [ ] 빈 상태 (Empty state) 화면
- [ ] 네비게이션에 "내 지원 현황" 링크 추가

## Error Handling

- [ ] 네트워크 오류 시 에러 토스트
- [ ] 409 중복 북마크 처리
- [ ] 401 인증 만료 처리 (기존 interceptor 활용)
- [ ] 400 유효성 오류 메시지 표시
- [ ] 404 존재하지 않는 리소스 처리
- [ ] Optimistic update 실패 시 롤백

## Quality

- [ ] 모바일 반응형 (기존 sm: breakpoint 패턴 준수)
- [ ] 로딩 상태 표시 (skeleton 또는 spinner)
- [ ] 접근성 (aria-label, keyboard navigation)
- [ ] 기존 디자인 시스템 일관성 (Tailwind 패턴)
