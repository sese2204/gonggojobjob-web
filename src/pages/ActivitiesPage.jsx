import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, CheckCircle2, X, Database, Briefcase, Coffee, Bell, Mail, ExternalLink } from 'lucide-react';
import Nav from '../components/Nav';
import { useAuth } from '../contexts/AuthContext';
import { searchActivities } from '../api/activities';
import { getStats } from '../api/jobs';
import MyRecommendedActivities from '../components/MyRecommendedActivities';
import ActivityCard from '../components/ActivityCard';
import SearchTabs from '../components/SearchTabs';
import SearchQuotaIndicator from '../components/SearchQuotaIndicator';
import SearchLoadingScreen from '../components/SearchLoadingScreen';
import useSearchQuota from '../hooks/useSearchQuota';
import useHistoryState from '../hooks/useHistoryState';
import useRecentSearches from '../hooks/useRecentSearches';
import { ACTIVITY_TAG_DATA, ACTIVITY_PLACEHOLDER_DATA } from '../constants/activity';

function loadSessionState() {
  try {
    const saved = sessionStorage.getItem('activitySearchState');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveSessionState(step, searchResults) {
  try {
    if (step === 'results' && searchResults) {
      sessionStorage.setItem('activitySearchState', JSON.stringify({ step, searchResults }));
    } else {
      sessionStorage.removeItem('activitySearchState');
    }
  } catch {}
}

export default function ActivitiesPage() {
  const { isLoggedIn, isLoading, login: authLogin } = useAuth();

  const savedState = !isLoading && !isLoggedIn ? loadSessionState() : null;

  const [view, setView] = useState(isLoggedIn ? 'my-activities' : 'search');
  const [step, setStep] = useState(savedState?.step || 'input');
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(Object.keys(ACTIVITY_TAG_DATA)[0]);
  const [searchResults, setSearchResults] = useState(savedState?.searchResults || null);
  const [searchError, setSearchError] = useState(null);
  const [stats, setStats] = useState(null);
  const [showInAppBrowserModal, setShowInAppBrowserModal] = useState(false);

  const quota = useSearchQuota(isLoggedIn, 'activities');
  const abortRef = useRef(null);

  useHistoryState({ view, step, setView, setStep });
  const recentSearches = useRecentSearches();

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || '';
    return /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|everytime|SamsungBrowser\/\d.*Mobile VR/i.test(ua)
      || (ua.includes('wv') && ua.includes('Android'))
      || (window.webkit?.messageHandlers && !/Safari/i.test(ua));
  };

  const login = () => {
    if (isInAppBrowser()) {
      setShowInAppBrowserModal(true);
      return;
    }
    if (selectedTags.length > 0 || query.trim() !== '') {
      localStorage.setItem('pendingActivitySearch', JSON.stringify({ tags: selectedTags, query }));
    }
    authLogin();
  };

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      const pending = localStorage.getItem('pendingActivitySearch');
      if (pending) {
        localStorage.removeItem('pendingActivitySearch');
        let tags, q;
        try {
          ({ tags, query: q } = JSON.parse(pending));
        } catch {
          return;
        }
        setSelectedTags(tags || []);
        setQuery(q || '');
        setView('search');
        setStep('loading');
        searchActivities({ tags: tags || [], query: q || '' })
          .then((res) => {
            setSearchResults(res.data);
            setStep('results');
          })
          .catch(() => {
            setView('my-activities');
            setStep('input');
          });
        return;
      }
      setView('my-activities');
    } else if (!isLoading && !isLoggedIn) {
      setView('search');
    }
  }, [isLoggedIn, isLoading]);

  useEffect(() => {
    if (!isLoggedIn) {
      saveSessionState(step, searchResults);
    }
  }, [step, searchResults, isLoggedIn]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const removeTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSearch = async () => {
    if (selectedTags.length === 0) {
      setSearchError('관심 키워드를 최소 1개 이상 선택해주세요!');
      return;
    }

    if (quota.isExhausted) {
      setSearchError(
        isLoggedIn
          ? '오늘 검색 횟수(5회)를 모두 사용했어요. 내일 다시 이용해주세요!'
          : '비로그인 상태에서는 하루 3번까지만 검색할 수 있어요. 로그인하면 하루 5번까지 검색할 수 있어요!'
      );
      return;
    }
    quota.increment();

    abortRef.current = new AbortController();
    setStep('loading');
    setSearchError(null);

    try {
      const res = await searchActivities({ tags: selectedTags, query }, { signal: abortRef.current.signal });
      setSearchResults(res.data);
      setStep('results');
      recentSearches.save(selectedTags, query, 'activities');
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      quota.rollback();
      setSearchError(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
      setStep('input');
    } finally {
      abortRef.current = null;
    }
  };

  const handleCancelSearch = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    quota.rollback();
    setStep('input');
  };

  const goToSearch = () => {
    setView('search');
    setStep('input');
    setSearchError(null);
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

      <main className={`w-full mx-auto mt-10 px-4 pb-12 flex-grow ${(view === 'search' || !isLoggedIn) && step === 'results' && searchResults ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* 로그인 + 추천 활동 뷰 */}
        {isLoggedIn && view === 'my-activities' && (
          <MyRecommendedActivities onGoSearch={goToSearch} />
        )}

        {/* 검색 입력 뷰 */}
        {(view === 'search' || !isLoggedIn) && step === 'input' && (
          <div className="bg-white p-5 sm:p-10 rounded-2xl shadow-sm border border-gray-100 transition-all">
            {isLoggedIn && (
              <button
                onClick={() => setView('my-activities')}
                className="text-sm text-blue-600 hover:underline flex items-center mb-6 font-medium gap-1"
              >
                ← 내 추천 활동으로 돌아가기
              </button>
            )}

            <SearchTabs activeTab="activities" />

            <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">AI 대외활동 검색기</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              공모전, 봉사활동, 서포터즈 등 대외활동을 AI가 찾아드려요!<br/>
              관심 분야 키워드를 고르고, 원하는 조건을 적어주세요.
            </p>

            {searchError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span>{searchError}</span>
                {!isLoggedIn && searchError.includes('비로그인') && (
                  <button
                    onClick={login}
                    className="shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    로그인하기
                  </button>
                )}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">1. 관심 분야 골라주세요</label>

              <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-100 pb-4" role="tablist" aria-label="키워드 카테고리">
                {Object.keys(ACTIVITY_TAG_DATA).map((category) => (
                  <button
                    key={category}
                    role="tab"
                    aria-selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
                      activeCategory === category
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 mb-6 min-h-[80px] p-2 bg-gray-50/50 rounded-lg" role="tabpanel" aria-label={`${activeCategory} 키워드`}>
                {ACTIVITY_TAG_DATA[activeCategory].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    aria-pressed={selectedTags.includes(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {selectedTags.length > 0 && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-blue-800 mb-2">내가 찜한 키워드 ({selectedTags.length}개)</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="flex items-center space-x-1 bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)} aria-label={`${tag} 제거`} className="hover:text-red-500 hover:bg-blue-50 rounded-full p-0.5 transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">2. 원하는 활동 조건을 적어주세요</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 500))}
                maxLength={500}
                placeholder={ACTIVITY_PLACEHOLDER_DATA[activeCategory]}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-shadow text-sm"
              />
              <p className={`text-xs mt-1 text-right ${query.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                {query.length}/500
              </p>
            </div>

            <button
              onClick={handleSearch}
              disabled={selectedTags.length === 0 || quota.isExhausted}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm ${
                selectedTags.length === 0 || quota.isExhausted
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Search size={20} />
              <span>{selectedTags.length > 0 ? `${selectedTags.length}개 키워드로 ` : ''}내 조건에 맞는 활동 찾아보기</span>
            </button>

            <SearchQuotaIndicator remaining={quota.remaining} maxCount={quota.maxCount} isLoggedIn={isLoggedIn} />

            {searchResults && (
              <button
                onClick={() => setStep('results')}
                className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 flex items-center justify-center gap-1"
              >
                이전 검색 결과 다시 보기 <ChevronRight size={14} />
              </button>
            )}

            {!isLoggedIn && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bell size={14} className="text-blue-500" />
                    매일 접속해서 검색하기 귀찮으신가요?
                  </span>
                  <button onClick={login} className="text-blue-600 font-bold hover:underline">
                    로그인하고 새 활동 알아서 배달받기
                  </button>
                </p>
              </div>
            )}

            {recentSearches.searches.filter((s) => s.searchTab === 'activities').length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500 mb-2">최근 검색 조건</p>
                <div className="flex flex-col gap-2">
                  {recentSearches.searches
                    .filter((s) => s.searchTab === 'activities')
                    .map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedTags(s.tags);
                          setQuery(s.query);
                        }}
                        className="text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span className="font-medium">{s.tags.join(', ')}</span>
                        {s.query && <span className="text-gray-400 ml-2 truncate">— {s.query}</span>}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 로딩 */}
        {(view === 'search' || !isLoggedIn) && step === 'loading' && (
          <SearchLoadingScreen onCancel={handleCancelSearch} searchType="activities" />
        )}

        {/* 검색 결과 */}
        {(view === 'search' || !isLoggedIn) && step === 'results' && searchResults && (
          <div className="animate-fade-in-up flex gap-6 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">짜잔! AI가 찾은 추천 활동 <img src="/char-standing.png" alt="" className="w-14 h-14 sm:w-16 sm:h-16 inline-block" /></h2>
                  <p className="text-sm text-gray-500">
                    총 {searchResults.totalCount}개 중 매칭률 높은 활동을 뽑았어요.
                    {searchResults.newTodayCount > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">오늘 새로 올라온 활동 {searchResults.newTodayCount}개!</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setView('my-activities');
                    } else {
                      setStep('input');
                    }
                  }}
                  className="text-sm text-blue-600 hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
                >
                  {isLoggedIn ? '← 내 추천 활동' : '조건 다시 쓰기'} <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {searchResults.activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={login}
                    bookmarkIdField="activityListingId"
                  />
                ))}
              </div>

              {!isLoggedIn && (
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-2">
                      <Mail size={20} className="text-blue-600" />
                      이 조건 그대로, 내일부터 매일 배달해 드릴까요?
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      매일 들어와서 검색할 필요 없어요! 한 번만 로그인해 두시면,<br className="hidden md:block"/>
                      제가 <strong>매일 아침 새로 올라온 맞춤 활동만 쏙쏙 골라서</strong> 알려드릴게요.
                    </p>
                  </div>
                  <button
                    onClick={login}
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all hover:scale-105 whitespace-nowrap"
                  >
                    3초만에 가입하고 알림 받기
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-900 py-6 shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12">
            <div className="flex items-center space-x-3 text-gray-300">
              <Database size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                현재 진행 중인 공고 <strong className="text-white text-lg ml-1">{stats ? ((stats.totalCount || 0) + (stats.activityTotalCount || 0)).toLocaleString() : '...'}</strong>개
              </span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Briefcase size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                오늘 봇이 새로 주워온 공고 <strong className="text-white text-lg ml-1">{stats ? ((stats.newTodayCount || 0) + (stats.activityNewTodayCount || 0)).toLocaleString() : '...'}</strong>개
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-5 flex items-center justify-center gap-1">
            <Coffee size={14} /> 공고줍줍은 매일 새벽 제 서버가 열심히 돌아가며 데이터를 모으고 있어요. 세상의 모든 취준생 화이팅!
          </p>
          <p className="text-center text-xs text-gray-600 mt-3 flex items-center justify-center gap-1.5">
            <Mail size={12} /> 피드백 및 문의: <a href="mailto:sese2204@gmail.com" className="text-blue-400 hover:underline">sese2204@gmail.com</a>
          </p>
          <div className="flex justify-center items-center gap-3 mt-4 text-xs text-gray-500">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">개인정보처리방침</Link>
            <span className="text-gray-700">|</span>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">이용약관</Link>
          </div>
        </div>
      </footer>

      {/* 인앱 브라우저 안내 모달 */}
      {showInAppBrowserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInAppBrowserModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <img src="/char-sitting.png" alt="" className="w-28 h-28 mx-auto mb-3 drop-shadow-md" />
              <h3 className="text-lg font-bold text-gray-800 mb-2">외부 브라우저에서 열어주세요</h3>
              <p className="text-sm text-gray-600 mb-4">
                인앱 브라우저에서는 Google 로그인이 제한돼요.<br />
                아래 방법으로 외부 브라우저에서 열어주세요!
              </p>
              <div className="bg-gray-50 rounded-xl p-4 text-left text-sm text-gray-700 space-y-2 mb-4">
                <p><strong>Android:</strong> 우측 상단 <strong>⋮</strong> → "다른 브라우저로 열기"</p>
                <p><strong>iPhone:</strong> 하단 <strong>Safari로 열기</strong> 또는 공유 → Safari</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 mb-4">
                <ExternalLink size={16} className="text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 text-left">주소창에 <strong>job-jub.com</strong>을 직접 입력해도 돼요!</p>
              </div>
              <button
                onClick={() => setShowInAppBrowserModal(false)}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
