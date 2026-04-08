import { Link } from 'react-router-dom';
import { Bookmark, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Nav({ onLogoClick }) {
  const { user, isLoggedIn, login, logout } = useAuth();

  const logoContent = (
    <>
      <img src="/icon.png" alt="공고줍줍" className="w-7 h-7" />
      공고줍줍
    </>
  );

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 bg-white border-b border-gray-100 shrink-0">
      {onLogoClick ? (
        <button
          onClick={onLogoClick}
          className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {logoContent}
        </button>
      ) : (
        <Link
          to="/"
          className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {logoContent}
        </Link>
      )}

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/bookmarks"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <Bookmark size={16} />
              내 공고
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <User size={18} />
              )}
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 font-medium transition-colors flex items-center gap-1.5"
          >
            <Bell size={14} /> 새 공고 알림받기
          </button>
        )}
      </div>
    </nav>
  );
}
