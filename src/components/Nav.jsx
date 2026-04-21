import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function PawLogo() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="15" cy="22" rx="6.5" ry="5" fill="#2563EB" />
      <ellipse cx="6.8" cy="15.2" rx="2.3" ry="2.9" fill="#2563EB" />
      <ellipse cx="11.8" cy="10" rx="2.3" ry="2.9" fill="#2563EB" />
      <ellipse cx="18.2" cy="10" rx="2.3" ry="2.9" fill="#2563EB" />
      <ellipse cx="23.2" cy="15.2" rx="2.3" ry="2.9" fill="#2563EB" />
      <ellipse cx="15" cy="22.5" rx="3.8" ry="2.8" fill="#60A5FA" opacity="0.35" />
    </svg>
  );
}

export default function Nav({ onLogoClick }) {
  const { user, isLoggedIn, login, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const logoContent = (
    <>
      <PawLogo />
      <span className="text-xl font-extrabold text-gray-900 tracking-tight" style={{ letterSpacing: '-0.04em' }}>
        공고<span className="text-blue-600">줍줍</span>
      </span>
    </>
  );

  const logoClassName = 'flex items-center gap-2 hover:opacity-80 transition-opacity';
  const logoStyle = { whiteSpace: 'nowrap' };

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 py-4 shrink-0 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md' : 'bg-white'
      }`}
    >
      {onLogoClick ? (
        <button onClick={onLogoClick} className={logoClassName} style={logoStyle}>
          {logoContent}
        </button>
      ) : (
        <Link to="/" className={logoClassName} style={logoStyle}>
          {logoContent}
        </Link>
      )}

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/bookmarks"
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium"
              title="저장목록"
            >
              <Bookmark size={16} />
              <span className="hidden sm:inline">저장목록</span>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt="" className="w-7 h-7 rounded-full" />
              ) : (
                <User size={18} />
              )}
              <span className="hidden sm:inline font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">로그아웃</span>
            </button>
          </>
        ) : (
          <button
            onClick={login}
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 font-medium transition-colors flex items-center gap-1.5"
          >
            <Bell size={14} /> <span className="hidden sm:inline">새 공고 알림받기</span><span className="sm:hidden">알림받기</span>
          </button>
        )}
      </div>
    </nav>
  );
}
