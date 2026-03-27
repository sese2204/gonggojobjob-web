import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, ChevronRight, CheckCircle2, X, Database, Briefcase, Coffee, Bell, Mail, LogOut, User, Clock, ExternalLink } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { searchJobs, getStats } from './api/jobs';
import { getRecommendedJobs, deleteRecommendedJob } from './api/searchHistory';
import OAuthCallback from './pages/OAuthCallback';

const TAG_DATA = {
  '💻 개발': ['Java', 'Spring Boot', 'Python', 'AWS', 'JPA', 'React', 'Node.js', 'AI/ML', '데이터 엔지니어링'],
  '🎨 기획/디자인': ['서비스 기획', 'UX/UI 디자인', 'Figma', '프로덕트 매니저(PM)', '데이터 분석', 'Adobe XD'],
  '📈 마케팅/비즈니스': ['퍼포먼스 마케팅', '콘텐츠 마케팅', 'B2B 영업', 'GA4', '브랜드 마케팅', 'CRM'],
  '💼 경영/사무/인사': ['인사(HR)', '총무', '재무/회계', '경영기획', '법무', '사무보조', '조직문화'],
  '🤝 영업/고객상담': ['국내영업', '해외영업', 'CS(고객지원)', '영업기획', '인바운드', '아웃바운드'],
  '📝 미디어/홍보': ['언론보도', '사내방송', 'SNS운영', '카피라이팅', '영상편집', '기자/에디터']
};

const PLACEHOLDER_DATA = {
  '💻 개발': '예: Spring Boot랑 JPA로 2년 정도 백엔드 했고 AWS 배포 경험도 있어요. 대용량 트래픽 다뤄볼 수 있는 서버 개발자 자리 찾는데 유연근무제면 더 좋고!',
  '🎨 기획/디자인': '예: Figma로 앱 리디자인 프로젝트 리드해봤고 사용자 리서치도 직접 했어요. 데이터 보면서 프로덕트 개선하는 PM 직무 찾아요. 판교나 강남 희망!',
  '📈 마케팅/비즈니스': '예: GA4로 전환 퍼널 분석하고 광고 ROAS 300% 달성한 경험 있어요. 퍼포먼스 마케팅이랑 데이터 분석 같이 할 수 있는 수평적인 곳 원함!',
  '💼 경영/사무/인사': '예: 스타트업에서 채용 프로세스 세팅부터 온보딩 설계까지 해봤어요. 채용부터 평가보상까지 해볼 수 있는 HR 직무, 워라밸 보장되는 중견기업 이상!',
  '🤝 영업/고객상담': '예: IT SaaS 제품 B2B 영업 1년 했고 영어로 해외 클라이언트 미팅 가능해요. 해외영업 경험 살릴 수 있는 글로벌 기업 찾음!',
  '📝 미디어/홍보': '예: 기업 인스타 팔로워 2만→8만 성장시킨 경험 있고 숏폼 영상 기획/편집 가능해요. 트렌디하고 자유로운 회사에서 콘텐츠 만들고 싶다!'
};

// sessionStorage 헬퍼 (비로그인 검색 결과 새로고침 유지용)
function loadSessionState() {
  try {
    const saved = sessionStorage.getItem('searchState');
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveSessionState(step, searchResults) {
  try {
    if (step === 'results' && searchResults) {
      sessionStorage.setItem('searchState', JSON.stringify({ step, searchResults }));
    } else {
      sessionStorage.removeItem('searchState');
    }
  } catch {}
}

// 내 추천 공고 목록 컴포넌트
function CoffeeSide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden lg:block w-56 shrink-0 sticky top-10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow cursor-pointer"
      >
        <span className="text-2xl">☕</span>
        <p className="text-sm font-bold text-gray-800 mt-1">개발자에게 커피 사주기</p>
      </button>
      {open && (
        <div className="mt-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center animate-fade-in-up">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            혼자서 서버 돌리고 AI API 비용 내면서 운영 중입니다... 커피 한 잔이면 서버비 하루치가 돼요 🥲
          </p>
          <div className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-[10px] text-gray-400 mb-0.5">국민은행</p>
            <p className="text-xs text-gray-800 font-mono font-bold">828202-04-310820</p>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">작은 후원이 큰 힘이 됩니다!</p>
        </div>
      )}
    </div>
  );
}

function MyRecommendedJobs({ onGoSearch }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isEmpty, setIsEmpty] = useState(false);
  const [sortBy, setSortBy] = useState('matchScore,desc');
  const [deletingId, setDeletingId] = useState(null);

  const fetchJobs = async (pageNum, sort) => {
    setLoading(true);
    try {
      const res = await getRecommendedJobs({ page: pageNum, size: 10, sort: [sort] });
      setJobs(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setIsEmpty((res.data.content || []).length === 0 && pageNum === 0);
    } catch {
      setJobs([]);
      setIsEmpty(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (deletingId) return;
    setDeletingId(jobId);
    try {
      await deleteRecommendedJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      if (jobs.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else if (jobs.length === 1 && page === 0) {
        setIsEmpty(true);
      }
    } catch {
      // 삭제 실패 시 무시
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchJobs(page, sortBy);
  }, [page, sortBy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-60 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 text-sm">내 추천 공고를 불러오는 중...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold mb-2">아직 추천받은 공고가 없어요</h2>
        <p className="text-gray-500 mb-6">AI 검색을 해보면 추천 공고가 여기에 쌓여요!</p>
        <button
          onClick={onGoSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <Search size={18} />
          공고 검색하러 가기
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">내 추천 공고 📋</h2>
          <p className="text-sm text-gray-500">AI가 매칭해준 공고들이에요.</p>
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
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <CheckCircle2 size={12} /> AI 찰떡 지수 {job.matchScore}%
                </span>
                <span className="text-sm text-gray-500 font-medium">{job.company}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(job.searchedAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors cursor-pointer">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
                🤖 <strong>AI 코멘트:</strong> {job.reason}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-3">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
              >
                공고 보러가기 <ExternalLink size={14} />
              </a>
              <button
                onClick={() => handleDelete(job.id)}
                disabled={deletingId === job.id}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
              >
                <X size={14} />
                {deletingId === job.id ? '삭제 중...' : '삭제'}
              </button>
            </div>
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

function HomePage() {
  const { isLoggedIn, isLoading, user, login, logout } = useAuth();

  // 비로그인 시 sessionStorage에서 검색 결과 복원
  const savedState = !isLoading && !isLoggedIn ? loadSessionState() : null;

  const [view, setView] = useState(isLoggedIn ? 'my-jobs' : 'search'); // 'my-jobs' | 'search'
  const [step, setStep] = useState(savedState?.step || 'input');
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('💻 개발');
  const [searchResults, setSearchResults] = useState(savedState?.searchResults || null);
  const [searchError, setSearchError] = useState(null);
  const [stats, setStats] = useState(null);

  // 통계 로드
  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  // 로그인 상태 변경 시 view 업데이트
  useEffect(() => {
    if (!isLoading) {
      setView(isLoggedIn ? 'my-jobs' : 'search');
    }
  }, [isLoggedIn, isLoading]);

  // 검색 결과를 sessionStorage에 저장 (비로그인 새로고침 대응)
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
    if (selectedTags.length === 0 && query.trim() === '') return;
    setStep('loading');
    setSearchError(null);

    try {
      const res = await searchJobs({ tags: selectedTags, query });
      setSearchResults(res.data);
      setStep('results');
    } catch (err) {
      setSearchError(err.response?.data?.message || '검색 중 오류가 발생했습니다.');
      setStep('input');
    }
  };

  const goToSearch = () => {
    setView('search');
    setStep('input');
    setSearchResults(null);
    setSearchError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shrink-0">
        <button
          onClick={() => {
            if (isLoggedIn) {
              setView('my-jobs');
            } else {
              setStep('input');
              setSearchResults(null);
              sessionStorage.removeItem('searchState');
            }
          }}
          className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          👀 공고줍줍
        </button>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
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

      <main className={`w-full mx-auto mt-10 px-4 pb-12 flex-grow ${(view === 'search' || !isLoggedIn) && step === 'results' && searchResults ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* 로그인 + 내 추천 공고 뷰 */}
        {isLoggedIn && view === 'my-jobs' && (
          <MyRecommendedJobs onGoSearch={goToSearch} />
        )}

        {/* 검색 입력 뷰 */}
        {(view === 'search' || !isLoggedIn) && step === 'input' && (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 transition-all">
            {isLoggedIn && (
              <button
                onClick={() => setView('my-jobs')}
                className="text-sm text-blue-600 hover:underline flex items-center mb-6 font-medium gap-1"
              >
                ← 내 추천 공고로 돌아가기
              </button>
            )}

            <h1 className="text-3xl font-bold mb-3 tracking-tight">제가 취준하려고 만든 AI 공고 검색기 🧑‍💻</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              매번 채용 포털 뒤지기 너무 귀찮아서 주말에 직접 만들었습니다.<br/>
              직군 키워드 고르고, 원하는 조건을 대충 텍스트로 적어주시면 AI가 찰떡같이 찾아드려요! (다들 취뽀 화이팅 🍀)
            </p>

            {searchError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {searchError}
              </div>
            )}

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">1. 관심 키워드 콕 집어주세요</label>

              <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-100 pb-4">
                {Object.keys(TAG_DATA).map((category) => (
                  <button
                    key={category}
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

              <div className="flex flex-wrap gap-2 mb-6 min-h-[80px] p-2 bg-gray-50/50 rounded-lg">
                {TAG_DATA[activeCategory].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
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
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500 hover:bg-blue-50 rounded-full p-0.5 transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3">2. AI한테 속마음 말하기 (그냥 편하게 적으세요!)</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={PLACEHOLDER_DATA[activeCategory]}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-shadow text-sm"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm"
            >
              <Search size={20} />
              <span>{selectedTags.length > 0 ? `${selectedTags.length}개 키워드로 ` : ''}내 조건에 맞는 공고 찾아보기</span>
            </button>

            {!isLoggedIn && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
                  <Bell size={14} className="text-blue-500" />
                  매일 접속해서 검색하기 귀찮으신가요?
                  <button onClick={login} className="text-blue-600 font-bold hover:underline ml-1">
                    로그인하고 새 공고 알아서 배달받기
                  </button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 로딩 */}
        {(view === 'search' || !isLoggedIn) && step === 'loading' && (
          <div className="flex flex-col items-center justify-center h-80 space-y-5">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium animate-pulse">AI가 열심히 공고를 뒤지는 중입니다... 잠시만요! 🏃💨</p>
          </div>
        )}

        {/* 검색 결과 */}
        {(view === 'search' || !isLoggedIn) && step === 'results' && searchResults && (
          <div className="animate-fade-in-up flex gap-6 items-start">
            {/* 결과 목록 */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">짜잔! AI가 찾은 추천 공고 🎉</h2>
                  <p className="text-sm text-gray-500">
                    총 {searchResults.totalCount}개 중 매칭률 높은 공고를 뽑았어요.
                    {searchResults.newTodayCount > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">오늘 새로 올라온 공고 {searchResults.newTodayCount}개!</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setView('my-jobs');
                    } else {
                      setStep('input');
                    }
                  }}
                  className="text-sm text-blue-600 hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
                >
                  {isLoggedIn ? '← 내 추천 공고' : '조건 다시 쓰기'} <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {searchResults.jobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center group">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                          <CheckCircle2 size={12} /> AI 찰떡 지수 {job.match}%
                        </span>
                        <span className="text-sm text-gray-500 font-medium">{job.company}</span>
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition-colors cursor-pointer">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 inline-block px-3 py-1.5 rounded-lg">
                        🤖 <strong>AI 코멘트:</strong> {job.reason}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                      >
                        공고 보러가기
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {!isLoggedIn && (
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2 mb-2">
                      <Mail size={20} className="text-blue-600" />
                      이 조건 그대로, 내일부터 매일 배달해 드릴까요? 💌
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      매일 들어와서 검색할 필요 없어요! 한 번만 로그인해 두시면,<br className="hidden md:block"/>
                      제가 <strong>매일 아침 새로 올라온 맞춤 공고만 쏙쏙 골라서</strong> 알려드릴게요.
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

            {/* 사이드 - 개발자에게 커피 사주기 */}
            <CoffeeSide />
          </div>
        )}
      </main>

      <footer className="bg-gray-900 py-6 mt-8 shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12">
            <div className="flex items-center space-x-3 text-gray-300">
              <Database size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                제가 긁어모은 누적 공고 <strong className="text-white text-lg ml-1">{stats ? stats.totalCount.toLocaleString() : '...'}</strong>개
              </span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Briefcase size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                오늘 봇이 새로 주워온 공고 <strong className="text-white text-lg ml-1">{stats ? stats.newTodayCount.toLocaleString() : '...'}</strong>개
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-5 flex items-center justify-center gap-1">
            <Coffee size={14} /> 공고줍줍은 매일 새벽 제 서버가 열심히 돌아가며 데이터를 모으고 있어요. 세상의 모든 취준생 화이팅!
          </p>
          <p className="text-center text-xs text-gray-600 mt-3 flex items-center justify-center gap-1.5">
            <Mail size={12} /> 피드백 및 문의: <a href="mailto:sese2204@gmail.com" className="text-blue-400 hover:underline">sese2204@gmail.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
    </Routes>
  );
}
