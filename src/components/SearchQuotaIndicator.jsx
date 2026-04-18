import { Search } from 'lucide-react';

export default function SearchQuotaIndicator({ remaining, maxCount, isLoggedIn }) {
  if (remaining > 2) {
    return (
      <p className="text-xs text-gray-400 text-center mt-2">
        <Search size={12} className="inline mr-1" />
        오늘 {remaining}/{maxCount}회 검색 가능
      </p>
    );
  }

  if (remaining > 0) {
    return (
      <p className="text-xs text-amber-600 text-center mt-2 font-medium">
        <Search size={12} className="inline mr-1" />
        오늘 {remaining}/{maxCount}회 남았어요
        {!isLoggedIn && <span className="text-gray-400 font-normal ml-1">(로그인 시 5회)</span>}
      </p>
    );
  }

  return (
    <p className="text-xs text-red-500 text-center mt-2 font-medium">
      오늘 검색 횟수를 모두 사용했어요.
      {!isLoggedIn && <span className="text-gray-400 font-normal ml-1">(로그인 시 5회)</span>}
    </p>
  );
}
