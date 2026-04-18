import { CheckCircle2, ExternalLink, Clock, Calendar } from 'lucide-react';
import SaveBookmarkButton from './SaveBookmarkButton';

function isExpired(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date(new Date().toISOString().slice(0, 10));
}

function getDDay(deadline) {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline) - new Date(new Date().toISOString().slice(0, 10))) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'D-Day';
  return `D-${diff}`;
}

/**
 * @param {object} props
 * @param {object} props.job - 공고 데이터
 * @param {'recommended'|'search'} props.variant - recommended: 내 추천 공고, search: 검색 결과
 * @param {boolean} props.isLoggedIn
 * @param {function} [props.onLoginRequired]
 * @param {React.ReactNode} [props.actions] - 추가 액션 버튼 (FeedbackButtons 등)
 */
export default function JobCard({ job, variant = 'search', isLoggedIn, onLoginRequired, actions }) {
  const matchScore = variant === 'recommended' ? job.matchScore : job.match;
  const expired = isExpired(job.deadline);
  const dDay = getDDay(job.deadline);

  const bookmarkProps = variant === 'recommended'
    ? { recommendedJobId: job.id }
    : { jobListingId: job.id };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 size={12} /> AI 찰떡 지수 {matchScore}%
          </span>
          <span className="text-sm text-gray-500 font-medium">{job.company}</span>
          {variant === 'recommended' && job.searchedAt && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={10} />
              {new Date(job.searchedAt).toLocaleDateString('ko-KR')}
            </span>
          )}
          {expired && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold">마감됨</span>
          )}
          {!expired && dDay && (
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
              dDay === 'D-Day' || parseInt(dDay.replace('D-', '')) <= 3
                ? 'text-orange-600 bg-orange-50'
                : 'text-gray-500 bg-gray-100'
            }`}>
              <Calendar size={10} /> {dDay}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
          <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {job.title}
          </a>
        </h3>
        <p className="text-sm text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
          🤖 <strong>AI 코멘트:</strong> {job.reason}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
        >
          공고 보러가기 <ExternalLink size={14} />
        </a>
        <SaveBookmarkButton {...bookmarkProps} isLoggedIn={isLoggedIn} onLoginRequired={onLoginRequired} />
        {actions}
      </div>
    </div>
  );
}
