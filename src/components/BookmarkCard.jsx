import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Trash2, ChevronDown, Calendar, Tag } from 'lucide-react';
import { STATUS_CONFIG } from '../constants/bookmark';

export default function BookmarkCard({ bookmark, onStatusChange, onMemoChange, onDelete }) {
  const [memo, setMemo] = useState(bookmark.memo || '');
  const [memoFocused, setMemoFocused] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const prevMemoRef = useRef(bookmark.memo || '');
  const mountedRef = useRef(true);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const handleMemoBlur = () => {
    setMemoFocused(false);
    const trimmed = memo.trim();
    if (trimmed !== prevMemoRef.current) {
      prevMemoRef.current = trimmed;
      onMemoChange(bookmark.id, trimmed);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(bookmark.id);
    } finally {
      if (mountedRef.current) {
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    }
  };

  const statusEntry = STATUS_CONFIG[bookmark.status] || STATUS_CONFIG.NOT_APPLIED;
  const safeUrl = bookmark.url && /^https?:\/\//i.test(bookmark.url) ? bookmark.url : null;
  const isActivity = bookmark.type === 'ACTIVITY';
  const expired = isActivity && bookmark.endDate && new Date(bookmark.endDate) < new Date(new Date().toISOString().slice(0, 10));

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {isActivity && (
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-bold">대외활동</span>
        )}
        <span className="text-sm text-gray-500 font-medium">{bookmark.company}</span>
        {isActivity && bookmark.category && (
          <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Tag size={10} /> {bookmark.category}
          </span>
        )}
        {expired && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold">마감됨</span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(bookmark.bookmarkedAt).toLocaleDateString('ko-KR')} 저장
        </span>
      </div>
      {isActivity && (bookmark.startDate || bookmark.endDate) && (
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Calendar size={12} />
          {bookmark.startDate} ~ {bookmark.endDate}
        </p>
      )}

      {/* 제목 */}
      <h3 className="text-lg font-bold text-gray-900">
        {safeUrl ? (
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
          >
            {bookmark.title}
            <ExternalLink size={14} className="text-gray-400" />
          </a>
        ) : (
          bookmark.title
        )}
      </h3>

      {/* 설명 */}
      {bookmark.description && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{bookmark.description}</p>
      )}

      {/* 상태 + 메모 + 삭제 */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* 상태 드롭다운 */}
          <div className="relative inline-flex items-center">
            <select
              value={bookmark.status}
              onChange={(e) => onStatusChange(bookmark.id, e.target.value)}
              className={`appearance-none text-xs font-bold px-3 py-1.5 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${statusEntry.color}`}
            >
              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 pointer-events-none text-current" />
          </div>

          {/* 삭제 */}
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-red-600 font-medium">삭제할까요?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 font-bold hover:underline disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : '확인'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-gray-500 hover:underline"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              aria-label="공고 삭제"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* 메모 */}
        {memoFocused || memo ? (
          <div>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value.slice(0, 500))}
              onFocus={() => setMemoFocused(true)}
              onBlur={handleMemoBlur}
              placeholder="메모를 입력하세요..."
              aria-label="메모"
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-shadow"
              rows={2}
            />
            <p className={`text-xs mt-1 text-right ${memo.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
              {memo.length}/500
            </p>
          </div>
        ) : (
          <button
            onClick={() => setMemoFocused(true)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-left"
          >
            + 메모 추가
          </button>
        )}
      </div>
    </div>
  );
}
