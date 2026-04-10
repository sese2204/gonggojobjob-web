import { Link } from 'react-router-dom';
import { Briefcase, Globe } from 'lucide-react';

export default function SearchTabs({ activeTab, onTabChange }) {
  const tabs = [
    { key: 'jobs', label: '채용공고', icon: <Briefcase size={16} />, to: '/' },
    { key: 'activities', label: '대외활동', icon: <Globe size={16} />, to: '/activities' },
  ];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const className = `flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
          isActive
            ? 'text-blue-600 bg-blue-50 border border-blue-200'
            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-transparent'
        }`;

        if (onTabChange) {
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={className}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        }

        return (
          <Link key={tab.key} to={tab.to} className={className}>
            {tab.icon}
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
