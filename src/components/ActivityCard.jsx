import { CheckCircle2, ExternalLink, Calendar, Tag } from 'lucide-react';
import SaveBookmarkButton from './SaveBookmarkButton';

function isExpired(endDate) {
  if (!endDate) return false;
  return new Date(endDate) < new Date(new Date().toISOString().slice(0, 10));
}

export default function ActivityCard({ activity, isLoggedIn, onLoginRequired, bookmarkIdField = 'activityListingId' }) {
  const expired = isExpired(activity.endDate);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_8px_32px_rgba(37,99,235,0.10)] hover:-translate-y-0.5 hover:border-blue-200 transition-all duration-[280ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
            <CheckCircle2 size={12} /> AI 찰떡 지수 {activity.matchScore ?? activity.match}%
          </span>
          <span className="text-sm text-gray-500 font-medium">{activity.organizer}</span>
          {activity.category && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Tag size={10} /> {activity.category}
            </span>
          )}
          {expired && (
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-bold">마감됨</span>
          )}
        </div>
        <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors">
          {activity.url ? (
            <a href={activity.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {activity.title}
            </a>
          ) : (
            activity.title
          )}
        </h3>
        {(activity.startDate || activity.endDate) && (
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <Calendar size={12} />
            {activity.startDate} ~ {activity.endDate}
          </p>
        )}
        {activity.description && (
          <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
        )}
        {activity.reason && (
          <p className="text-sm text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
            🤖 <strong>AI 코멘트:</strong> {activity.reason}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 mt-4">
        {activity.url && (
          <a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
          >
            활동 보러가기 <ExternalLink size={14} />
          </a>
        )}
        <SaveBookmarkButton
          {...{ [bookmarkIdField]: activity.id }}
          isLoggedIn={isLoggedIn}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </div>
  );
}
