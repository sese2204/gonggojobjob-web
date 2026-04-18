import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * 가로 스크롤 가능한 영역에 좌우 그라데이션 힌트를 표시합니다.
 * children을 가로 스크롤 컨테이너로 감싸고, 스크롤 위치에 따라
 * 왼쪽/오른쪽 그라데이션을 표시하거나 숨깁니다.
 */
export default function ScrollHint({ children, className = '' }) {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateHints = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 4);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateHints();
    const observer = new ResizeObserver(updateHints);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateHints]);

  return (
    <div className={`relative ${className}`}>
      {showLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none z-10" />
      )}
      <div
        ref={scrollRef}
        onScroll={updateHints}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {children}
      </div>
      {showRight && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
}
