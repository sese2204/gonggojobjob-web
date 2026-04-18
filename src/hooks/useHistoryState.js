import { useEffect, useRef, useCallback } from 'react';

/**
 * view/step 상태를 브라우저 히스토리와 동기화합니다.
 * React Router와 충돌하지 않도록 URL은 변경하지 않고 history.state만 사용합니다.
 */
export default function useHistoryState({ view, step, setView, setStep }) {
  const isInitialMount = useRef(true);

  // view/step 변경 시 히스토리 엔트리 추가
  useEffect(() => {
    if (isInitialMount.current) {
      // 최초 마운트 시에는 현재 상태로 replaceState
      window.history.replaceState({ view, step }, '');
      isInitialMount.current = false;
      return;
    }
    // 이후 상태 변경 시 pushState
    window.history.pushState({ view, step }, '');
  }, [view, step]);

  // popstate(뒤로가기/앞으로가기) 처리
  const handlePopState = useCallback((e) => {
    const state = e.state;
    if (state && state.view !== undefined) {
      setView(state.view);
      setStep(state.step || 'input');
    }
  }, [setView, setStep]);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);
}
