import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getBookmarks, updateBookmark, deleteBookmark } from '../api/bookmarks';
import { STATUS_FILTERS, TYPE_FILTERS } from '../constants/bookmark';
import Nav from '../components/Nav';
import BookmarkCard from '../components/BookmarkCard';
import CustomJobModal from '../components/CustomJobModal';

const PAGE_SIZE = 20;

export default function BookmarksPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchBookmarks = useCallback(async (pageNum, filter, append) => {
    const currentFetchId = ++fetchIdRef.current;
    setLoading(true);
    try {
      const params = { page: pageNum, size: PAGE_SIZE };
      if (filter) params.status = filter;
      if (typeFilter) params.type = typeFilter;
      const res = await getBookmarks(params);

      if (currentFetchId !== fetchIdRef.current) return;

      const data = res.data;
      setBookmarks((prev) => append ? [...prev, ...data.content] : data.content);
      setTotalElements(data.totalElements);
      setHasMore(!data.last);
    } catch {
      if (currentFetchId !== fetchIdRef.current) return;
      if (!append) setBookmarks([]);
      setHasMore(false);
    } finally {
      if (currentFetchId === fetchIdRef.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  }, [typeFilter]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/');
      return;
    }
    if (isLoggedIn) {
      setBookmarks([]);
      setPage(0);
      setHasMore(true);
      setInitialLoading(true);
      fetchBookmarks(0, statusFilter, false);
    }
  }, [isLoggedIn, isLoading, statusFilter, typeFilter, navigate, fetchBookmarks]);

  const handleLoadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBookmarks(nextPage, statusFilter, true);
  };

  const handleFilterChange = (filter) => {
    if (filter === statusFilter) return;
    setStatusFilter(filter);
    setPage(0);
  };

  const handleTypeFilterChange = (filter) => {
    if (filter === typeFilter) return;
    setTypeFilter(filter);
    setPage(0);
  };

  const handleStatusChange = async (id, newStatus) => {
    const prev = bookmarks.find((b) => b.id === id);
    if (!prev) return;

    setBookmarks((list) =>
      list.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    try {
      await updateBookmark(id, { status: newStatus });
    } catch {
      setBookmarks((list) =>
        list.map((b) => (b.id === id ? { ...b, status: prev.status } : b))
      );
    }
  };

  const handleMemoChange = async (id, newMemo) => {
    const prev = bookmarks.find((b) => b.id === id)?.memo ?? '';
    setBookmarks((list) =>
      list.map((b) => (b.id === id ? { ...b, memo: newMemo } : b))
    );
    try {
      await updateBookmark(id, { memo: newMemo });
    } catch {
      setBookmarks((list) =>
        list.map((b) => (b.id === id ? { ...b, memo: prev } : b))
      );
    }
  };

  const handleDelete = async (id) => {
    await deleteBookmark(id);
    setBookmarks((list) => list.filter((b) => b.id !== id));
    setTotalElements((n) => Math.max(0, n - 1));
  };

  const handleCustomJobCreated = (bookmark) => {
    setBookmarks((prev) => [bookmark, ...prev]);
    setTotalElements((n) => n + 1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-3">
        <div className="char-loading w-36 h-36 drop-shadow-lg">
              <img src="/char-standing.png" alt="로딩 중" className="w-full h-full" />
              <img src="/char-sitting.png" alt="" className="w-full h-full" />
            </div>
        <p className="text-sm text-gray-400">잠시만 기다려주세요...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <Nav />

      <main className="w-full max-w-4xl mx-auto mt-10 px-4 pb-12 flex-grow">
        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">내 공고 <img src="/char-front.png" alt="" className="w-10 h-10 inline-block" /></h1>
            <p className="text-sm text-gray-500">
              {totalElements > 0 ? `총 ${totalElements}개의 저장된 공고` : '저장한 공고를 관리하세요'}
            </p>
          </div>
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 text-sm font-bold bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            공고 직접 추가
          </button>
        </div>

        {/* 타입 필터 */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {TYPE_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleTypeFilterChange(key)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
                typeFilter === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 상태 필터 탭 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 목록 */}
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center h-60 space-y-3">
            <div className="char-loading w-32 h-32 drop-shadow-md">
              <img src="/char-standing.png" alt="로딩 중" className="w-full h-full" />
              <img src="/char-sitting.png" alt="" className="w-full h-full" />
            </div>
            <p className="text-gray-500 text-sm">공고를 불러오는 중...</p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
            <img src="/char-sitting.png" alt="공고 없음" className="w-36 h-36 mx-auto mb-4 drop-shadow-md" />
            {statusFilter ? (
              <>
                <h2 className="text-xl font-bold mb-2">이 상태의 공고가 없어요</h2>
                <p className="text-gray-500 mb-6">다른 필터를 선택하거나 전체를 확인해보세요.</p>
                <button
                  onClick={() => handleFilterChange('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
                >
                  전체 보기
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">아직 저장한 공고가 없어요</h2>
                <p className="text-gray-500 mb-6">검색 결과나 추천 공고에서 마음에 드는 공고를 저장해보세요!</p>
                <Link
                  to="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <Search size={18} />
                  공고 검색하러 가기
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onStatusChange={handleStatusChange}
                  onMemoChange={handleMemoChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* 무한 스크롤 - 더 보기 */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 text-sm font-bold rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loading ? '불러오는 중...' : '더 보기'}
                </button>
              </div>
            )}

            {!hasMore && bookmarks.length > 0 && (
              <p className="text-center text-sm text-gray-400 mt-8">모든 공고를 불러왔습니다</p>
            )}
          </>
        )}
      </main>

      {/* 커스텀 공고 모달 */}
      <CustomJobModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={handleCustomJobCreated}
      />
    </div>
  );
}
