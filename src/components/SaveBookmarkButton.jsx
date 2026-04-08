import { useState, useRef, useEffect } from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { createBookmark } from '../api/bookmarks';

const STATES = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  DUPLICATE: 'duplicate',
  ERROR: 'error',
};

export default function SaveBookmarkButton({ jobListingId, recommendedJobId, isLoggedIn, onLoginRequired }) {
  const [status, setStatus] = useState(STATES.IDLE);
  const timeoutRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const revertAfterDelay = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current) setStatus(STATES.IDLE);
    }, 2500);
  };

  const handleClick = async () => {
    if (!isLoggedIn) {
      onLoginRequired?.();
      return;
    }

    if (status === STATES.SAVING) return;

    setStatus(STATES.SAVING);
    try {
      const body = jobListingId ? { jobListingId } : { recommendedJobId };
      await createBookmark(body);
      setStatus(STATES.SAVED);
      revertAfterDelay();
    } catch (err) {
      if (err.response?.status === 409) {
        setStatus(STATES.DUPLICATE);
      } else {
        setStatus(STATES.ERROR);
      }
      revertAfterDelay();
    }
  };

  const config = {
    [STATES.IDLE]: {
      text: '내 공고에 저장하기',
      icon: <Bookmark size={14} />,
      className: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    },
    [STATES.SAVING]: {
      text: '저장 중...',
      icon: <Bookmark size={14} />,
      className: 'bg-gray-100 text-gray-500 cursor-wait',
    },
    [STATES.SAVED]: {
      text: '저장 완료',
      icon: <CheckCircle2 size={14} />,
      className: 'bg-green-50 text-green-700',
    },
    [STATES.DUPLICATE]: {
      text: '이미 저장된 공고입니다',
      icon: <CheckCircle2 size={14} />,
      className: 'bg-yellow-50 text-yellow-700',
    },
    [STATES.ERROR]: {
      text: '저장 실패',
      icon: <Bookmark size={14} />,
      className: 'bg-red-50 text-red-700',
    },
  };

  const current = config[status];

  return (
    <button
      onClick={handleClick}
      disabled={status === STATES.SAVING}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-1.5 ${current.className}`}
    >
      {current.icon}
      {current.text}
    </button>
  );
}
