import { useState, useEffect } from 'react';
import { Briefcase, Globe, CheckCircle2, ExternalLink } from 'lucide-react';
import { getRecommendations } from '../api/recommendations';
import { JOB_CATEGORIES, ACTIVITY_CATEGORIES } from '../constants/recommendation';
import SaveBookmarkButton from './SaveBookmarkButton';

function CompactJobCard({ job, isLoggedIn, onLoginRequired }) {
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-56 bg-gray-50 rounded-xl p-3.5 hover:bg-blue-50 transition-colors group block"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
          <CheckCircle2 size={10} /> {job.matchScore}%
        </span>
        <span className="text-xs text-gray-400 truncate">{job.company}</span>
      </div>
      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
        {job.title}
      </p>
      {job.reason && (
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{job.reason}</p>
      )}
      <div className="flex items-center gap-2 mt-2" onClick={(e) => e.preventDefault()}>
        <SaveBookmarkButton
          jobListingId={job.jobListingId}
          isLoggedIn={isLoggedIn}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </a>
  );
}

function CompactActivityCard({ activity, isLoggedIn, onLoginRequired }) {
  return (
    <a
      href={activity.url}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 w-56 bg-gray-50 rounded-xl p-3.5 hover:bg-blue-50 transition-colors group block"
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
          <CheckCircle2 size={10} /> {activity.matchScore}%
        </span>
        <span className="text-xs text-gray-400 truncate">{activity.organizer}</span>
      </div>
      <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
        {activity.title}
      </p>
      {activity.reason && (
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-1">{activity.reason}</p>
      )}
      <div className="flex items-center gap-2 mt-2" onClick={(e) => e.preventDefault()}>
        <SaveBookmarkButton
          activityListingId={activity.activityListingId}
          isLoggedIn={isLoggedIn}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </a>
  );
}

export default function RecommendationsSection({ isLoggedIn, onLoginRequired }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [topTab, setTopTab] = useState('jobs');
  const [jobCategoryIdx, setJobCategoryIdx] = useState(0);
  const [activityCategoryIdx, setActivityCategoryIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // localStorage 캐시: generatedAt이 오늘이면 API 호출 생략
    const today = new Date().toISOString().slice(0, 10);
    try {
      const cached = JSON.parse(localStorage.getItem('recommendationsCache'));
      if (cached && cached.generatedAt === today) {
        setData(cached);
        setLoading(false);
        return;
      }
    } catch {}

    setLoading(true);
    getRecommendations()
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
          try {
            localStorage.setItem('recommendationsCache', JSON.stringify(res.data));
          } catch {}
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center justify-center gap-3">
        <div className="char-loading w-12 h-12 drop-shadow-sm">
          <img src="/char-standing.png" alt="로딩 중" className="w-full h-full" />
          <img src="/char-sitting.png" alt="" className="w-full h-full" />
        </div>
        <p className="text-gray-400 text-sm">오늘의 추천을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !data || !data.generatedAt) {
    return null;
  }

  const jobCategories = data.jobCategories || [];
  const activityCategories = data.activityCategories || [];
  const activeJobCategory = jobCategories[jobCategoryIdx];
  const activeActivityCategory = activityCategories[activityCategoryIdx];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 + 상위 탭 한줄 */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-1.5">
          <img src="/char-front.png" alt="" className="w-6 h-6" />
          오늘의 추천
          <span className="text-xs font-normal text-gray-400 ml-1">{data.generatedAt}</span>
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setTopTab('jobs')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              topTab === 'jobs'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Briefcase size={12} /> 채용
          </button>
          <button
            onClick={() => setTopTab('activities')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
              topTab === 'activities'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Globe size={12} /> 활동
          </button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 scrollbar-hide">
        {topTab === 'jobs' &&
          jobCategories.map((cat, idx) => {
            const icon = JOB_CATEGORIES.find((c) => c.category === cat.category)?.icon || '📋';
            return (
              <button
                key={cat.category}
                onClick={() => setJobCategoryIdx(idx)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  idx === jobCategoryIdx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs">{icon}</span>
                {cat.displayName}
              </button>
            );
          })}
        {topTab === 'activities' &&
          activityCategories.map((cat, idx) => {
            const icon = ACTIVITY_CATEGORIES.find((c) => c.category === cat.category)?.icon || '📋';
            return (
              <button
                key={cat.category}
                onClick={() => setActivityCategoryIdx(idx)}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  idx === activityCategoryIdx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <span className="text-xs">{icon}</span>
                {cat.displayName}
              </button>
            );
          })}
      </div>

      {/* 가로 스크롤 카드 */}
      <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {topTab === 'jobs' && activeJobCategory?.jobs?.length > 0 &&
          activeJobCategory.jobs.map((job) => (
            <CompactJobCard
              key={job.jobListingId}
              job={job}
              isLoggedIn={isLoggedIn}
              onLoginRequired={onLoginRequired}
            />
          ))}
        {topTab === 'jobs' && (!activeJobCategory?.jobs?.length) && (
          <p className="text-center text-gray-400 text-xs py-4 w-full">이 카테고리에는 아직 추천 공고가 없어요.</p>
        )}
        {topTab === 'activities' && activeActivityCategory?.activities?.length > 0 &&
          activeActivityCategory.activities.map((activity) => (
            <CompactActivityCard
              key={activity.activityListingId}
              activity={activity}
              isLoggedIn={isLoggedIn}
              onLoginRequired={onLoginRequired}
            />
          ))}
        {topTab === 'activities' && (!activeActivityCategory?.activities?.length) && (
          <p className="text-center text-gray-400 text-xs py-4 w-full">이 카테고리에는 아직 추천 활동이 없어요.</p>
        )}
      </div>
    </div>
  );
}
