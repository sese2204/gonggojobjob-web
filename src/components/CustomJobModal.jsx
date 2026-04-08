import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { createCustomBookmark } from '../api/bookmarks';

export default function CustomJobModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setTitle('');
    setCompany('');
    setUrl('');
    setDescription('');
    setErrors({});
    setApiError('');
    const id = setTimeout(() => titleRef.current?.focus(), 100);
    return () => clearTimeout(id);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const next = {};
    if (!title.trim()) next.title = '제목을 입력해주세요';
    if (!company.trim()) next.company = '회사명을 입력해주세요';
    if (url.trim() && !/^https?:\/\//i.test(url.trim())) {
      next.url = 'URL은 http:// 또는 https://로 시작해야 합니다';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');
    try {
      const res = await createCustomBookmark({
        title: title.trim(),
        company: company.trim(),
        url: url.trim() || undefined,
        description: description.trim() || undefined,
      });
      onSubmit(res.data);
      onClose();
    } catch (err) {
      setApiError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">공고 직접 추가</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 255))}
              placeholder="예: 프론트엔드 개발자"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value.slice(0, 255))}
              placeholder="예: 토스"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.url && <p className="text-xs text-red-500 mt-1">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="공고 내용이나 메모..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
