import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SearchLoadingScreen({ onCancel, searchType = 'jobs' }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const label = searchType === 'jobs' ? '공고를 뒤지는' : '활동을 찾는';

  return (
    <div className="flex flex-col items-center justify-center h-80 space-y-4">
      <div className="char-loading w-40 h-40 drop-shadow-lg">
        <img src="/char-standing.png" alt="검색 중" className="w-full h-full" />
        <img src="/char-sitting.png" alt="" className="w-full h-full" />
      </div>
      <p className="text-gray-600 font-medium animate-pulse">
        AI가 열심히 {label} 중입니다... 잠시만요!
      </p>
      <p className="text-xs text-gray-400">
        {elapsed < 10
          ? '보통 10~20초 정도 걸려요'
          : `${elapsed}초 경과 — 조금만 더 기다려주세요`}
      </p>
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors flex items-center gap-1 mt-2"
        >
          <X size={14} />
          검색 취소
        </button>
      )}
    </div>
  );
}
