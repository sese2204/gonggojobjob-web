import { CheckCircle2, ExternalLink } from 'lucide-react';
import SaveBookmarkButton from './SaveBookmarkButton';

export default function RecommendationJobCard({ job, isLoggedIn, onLoginRequired }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <CheckCircle2 size={12} /> AI 찰떡 지수 {job.matchScore}%
        </span>
        <span className="text-sm text-gray-500 font-medium">{job.company}</span>
      </div>
      <h3 className="text-base font-bold group-hover:text-blue-600 transition-colors">
        {job.title}
      </h3>
      {job.reason && (
        <p className="text-sm text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
          🤖 <strong>AI 코멘트:</strong> {job.reason}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
        >
          공고 보기 <ExternalLink size={14} />
        </a>
        <SaveBookmarkButton
          jobListingId={job.jobListingId}
          isLoggedIn={isLoggedIn}
          onLoginRequired={onLoginRequired}
        />
      </div>
    </div>
  );
}
