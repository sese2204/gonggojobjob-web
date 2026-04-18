import { useState } from 'react';
import { ThumbsDown, Check, X } from 'lucide-react';

const FEEDBACK_OPTIONS = [
  { type: 'IRRELEVANT', icon: ThumbsDown, label: '관심없음' },
  { type: 'ALREADY_APPLIED', icon: Check, label: '이미 지원' },
  { type: 'CONDITIONS_MISMATCH', icon: X, label: '조건 안맞음' },
];

export default function FeedbackButtons({ onFeedback, onDelete }) {
  const [submitted, setSubmitted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleFeedback = async (type) => {
    setSubmitted(true);
    try {
      if (onFeedback) {
        await onFeedback(type);
      } else {
        await onDelete();
      }
    } catch {
      setSubmitted(false);
    }
  };

  if (submitted) {
    return <span className="text-xs text-gray-400 py-1">피드백 감사합니다</span>;
  }

  if (!showOptions) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowOptions(true)}
          className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
        >
          관심없음
        </button>
        <button
          onClick={() => onDelete()}
          className="text-sm text-gray-400 hover:text-red-500 font-medium transition-colors"
        >
          삭제
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 animate-fade-in-up">
      {FEEDBACK_OPTIONS.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => handleFeedback(type)}
          className="text-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
      <button
        onClick={() => setShowOptions(false)}
        className="text-xs text-gray-400 hover:text-gray-600 px-1 py-1 rounded-md transition-colors"
      >
        취소
      </button>
    </div>
  );
}
