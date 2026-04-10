import { useState, useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { getRecommendedActivities, deleteRecommendedActivity } from '../api/activitySearchHistory';
import ActivityCard from './ActivityCard';

export default function MyRecommendedActivities({ onGoSearch, onGoJobs }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sortBy, setSortBy] = useState('matchScore,desc');
  const [deletingId, setDeletingId] = useState(null);

  const fetchActivities = async (pageNum, sort) => {
    setLoading(true);
    try {
      const res = await getRecommendedActivities({ page: pageNum, size: 10, sort: [sort] });
      setActivities(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setIsEmpty((res.data.content || []).length === 0 && pageNum === 0);
    } catch {
      setActivities([]);
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (activityId) => {
    if (deletingId) return;
    setDeletingId(activityId);
    try {
      await deleteRecommendedActivity(activityId);
      setActivities((prev) => prev.filter((a) => a.id !== activityId));
      if (activities.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else if (activities.length === 1 && page === 0) {
        setIsEmpty(true);
      }
    } catch {
      // 삭제 실패 시 무시
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchActivities(page, sortBy);
  }, [page, sortBy]);

  const viewTabs = onGoJobs && (
    <div className="flex gap-2 mb-6">
      <button
        onClick={onGoJobs}
        className="px-4 py-2 text-sm font-bold rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-transparent"
      >
        채용공고
      </button>
      <button className="px-4 py-2 text-sm font-bold rounded-lg text-blue-600 bg-blue-50 border border-blue-200">
        대외활동
      </button>
    </div>
  );

  if (loading) {
    return (
      <div>
        {viewTabs}
        <div className="flex flex-col items-center justify-center h-60 space-y-3">
          <div className="char-loading w-32 h-32 drop-shadow-md">
            <img src="/char-standing.png" alt="로딩 중" className="w-full h-full" />
            <img src="/char-sitting.png" alt="" className="w-full h-full" />
          </div>
          <p className="text-gray-500 text-sm">내 추천 활동을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div>
        {viewTabs}
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
          <img src="/char-sitting.png" alt="활동 없음" className="w-36 h-36 mx-auto mb-4 drop-shadow-md" />
          <h2 className="text-xl font-bold mb-2">아직 추천받은 활동이 없어요</h2>
          <p className="text-gray-500 mb-6">AI 검색을 해보면 추천 활동이 여기에 쌓여요!</p>
          <button
            onClick={onGoSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <Search size={18} />
            활동 검색하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {viewTabs}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">내 추천 활동 <img src="/char-front.png" alt="" className="w-10 h-10 inline-block" /></h2>
          <p className="text-sm text-gray-500">AI가 매칭해준 활동들이에요.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(0); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="matchScore,desc">매칭률 높은 순</option>
            <option value="searchHistory.searchedAt,desc">최신 검색순</option>
          </select>
          <button
            onClick={onGoSearch}
            className="text-sm text-blue-600 hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-lg font-medium gap-1"
          >
            <Search size={14} />
            새로 검색하기
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <ActivityCard
              activity={activity}
              isLoggedIn={true}
              bookmarkIdField="recommendedActivityId"
            />
            <button
              onClick={() => handleDelete(activity.id)}
              disabled={deletingId === activity.id}
              className="absolute top-4 right-4 text-sm text-gray-400 hover:text-red-500 font-medium transition-colors disabled:opacity-50"
            >
              {deletingId === activity.id ? '삭제 중...' : '삭제'}
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <span className="text-sm text-gray-500">{page + 1} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
