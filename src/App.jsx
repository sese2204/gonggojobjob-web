import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, ChevronRight, CheckCircle2, X, Database, Briefcase, Coffee, Bell, Mail, Clock, ExternalLink, Heart, Send, MessageCircle, ChevronDown } from 'lucide-react';
import Nav from './components/Nav';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { searchJobs, getStats } from './api/jobs';
import { searchActivities } from './api/activities';
import { getRecommendedJobs, deleteRecommendedJob } from './api/searchHistory';
import { getCheers, postCheer } from './api/cheers';
import SaveBookmarkButton from './components/SaveBookmarkButton';
import ActivityCard from './components/ActivityCard';
import BookmarksPage from './pages/BookmarksPage';
import ActivitiesPage from './pages/ActivitiesPage';
import OAuthCallback from './pages/OAuthCallback';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import SearchTabs from './components/SearchTabs';
import RecommendationsSection from './components/RecommendationsSection';
import MyRecommendedActivities from './components/MyRecommendedActivities';
import { ACTIVITY_TAG_DATA, ACTIVITY_PLACEHOLDER_DATA } from './constants/activity';

const TAG_DATA = {
  '💻 개발': ['프론트엔드', '백엔드', '풀스택', '앱 개발', 'AI/ML 엔지니어', '데이터 엔지니어', 'DevOps/인프라', 'QA/테스트', '게임 개발', '보안 엔지니어', '임베디드/IoT', 'DBA'],
  '🎨 기획/디자인': ['서비스 기획자', '프로덕트 매니저(PM)', '프로덕트 오너(PO)', 'UX/UI 디자이너', 'UX 리서처', '데이터 분석가', 'BX 디자이너', '그래픽 디자이너'],
  '📈 마케팅/비즈니스': ['퍼포먼스 마케터', '콘텐츠 마케터', '브랜드 마케터', 'CRM 마케터', '그로스 해커', 'SEO 전문가', '광고 기획자', '사업 개발(BD)'],
  '💼 경영/사무/인사': ['인사(HR) 담당자', '채용 담당자', '재무/회계', '경영기획', '법무', '총무/사무', '조직문화 담당자', 'ESG 담당자'],
  '🤝 영업/고객상담': ['국내영업', '해외영업', 'B2B 영업', '기술영업(SE)', '영업기획', 'CS(고객지원)', 'CX(고객경험)', '솔루션 컨설턴트'],
  '📝 미디어/콘텐츠': ['영상 PD/편집자', '콘텐츠 크리에이터', 'SNS 운영자', '카피라이터', 'PR/홍보 담당자', '에디터/기자', '유튜브 운영자', '팟캐스트 PD']
};

const PLACEHOLDER_DATA = {
  '💻 개발': '예: Spring Boot랑 JPA로 2년 정도 백엔드 했고 AWS 배포 경험도 있어요. 대용량 트래픽 다뤄볼 수 있는 서버 개발자 자리 찾는데 유연근무제면 더 좋고!',
  '🎨 기획/디자인': '예: Figma로 앱 리디자인 프로젝트 리드해봤고 사용자 리서치도 직접 했어요. 데이터 보면서 프로덕트 개선하는 PM 직무 찾아요. 판교나 강남 희망!',
  '📈 마케팅/비즈니스': '예: GA4로 전환 퍼널 분석하고 광고 ROAS 300% 달성한 경험 있어요. 퍼포먼스 마케팅이랑 데이터 분석 같이 할 수 있는 수평적인 곳 원함!',
  '💼 경영/사무/인사': '예: 스타트업에서 채용 프로세스 세팅부터 온보딩 설계까지 해봤어요. 채용부터 평가보상까지 해볼 수 있는 HR 직무, 워라밸 보장되는 중견기업 이상!',
  '🤝 영업/고객상담': '예: IT SaaS 제품 B2B 영업 1년 했고 영어로 해외 클라이언트 미팅 가능해요. 해외영업 경험 살릴 수 있는 글로벌 기업 찾음!',
  '📝 미디어/콘텐츠': '예: 기업 인스타 팔로워 2만→8만 성장시킨 경험 있고 숏폼 영상 기획/편집 가능해요. 트렌디하고 자유로운 회사에서 콘텐츠 만들고 싶다!'
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

function CoffeeMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center hover:shadow-md transition-shadow"
      >
        <span className="text-xl">☕</span>
        <span className="text-sm font-bold text-gray-800 ml-2">개발자에게 커피 사주기</span>
      </button>
      {open && (
        <div className="mt-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center animate-fade-in-up">
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            혼자서 서버 돌리고 AI API 비용 내면서 운영 중입니다... 커피 한 잔이면 서버비 하루치가 돼요 🥲
          </p>
          <div className="bg-gray-50 rounded-lg px-3 py-2 inline-block">
            <p className="text-[10px] text-gray-400 mb-0.5">국민은행</p>
            <p className="text-xs text-gray-800 font-mono font-bold">828202-04-310820</p>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">작은 후원이 큰 힘이 됩니다!</p>
        </div>
      )}
    </div>
  );
}

function MyRecommendedJobs({ onGoSearch, onGoActivities }) {
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
      <div className="flex flex-col items-center justify-center h-60 space-y-3">
        <div className="char-loading w-32 h-32 drop-shadow-md">
              <img src="/char-standing.png" alt="로딩 중" className="w-full h-full" />
              <img src="/char-sitting.png" alt="" className="w-full h-full" />
            </div>
        <p className="text-gray-500 text-sm">내 추천 공고를 불러오는 중...</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 text-center">
        <img src="/char-sitting.png" alt="공고 없음" className="w-36 h-36 mx-auto mb-4 drop-shadow-md" />
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
      {/* 공고 / 대외활동 전환 탭 */}
      <div className="flex gap-2 mb-6">
        <button className="px-4 py-2 text-sm font-bold rounded-lg text-blue-600 bg-blue-50 border border-blue-200">
          채용공고
        </button>
        <button
          onClick={onGoActivities}
          className="px-4 py-2 text-sm font-bold rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-transparent"
        >
          대외활동
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">내 추천 공고 <img src="/char-front.png" alt="" className="w-10 h-10 inline-block" /></h2>
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
          <div key={job.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
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
            <div className="flex items-center gap-3 mt-4">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
              >
                공고 보러가기 <ExternalLink size={14} />
              </a>
              <SaveBookmarkButton recommendedJobId={job.id} isLoggedIn={true} />
              <button
                onClick={() => handleDelete(job.id)}
                disabled={deletingId === job.id}
                className="text-base text-gray-400 hover:text-red-500 font-medium transition-colors disabled:opacity-50"
              >
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

const CHEER_COLORS = [
  'bg-amber-50 border-amber-100',
  'bg-rose-50 border-rose-100',
  'bg-sky-50 border-sky-100',
  'bg-emerald-50 border-emerald-100',
  'bg-violet-50 border-violet-100',
  'bg-orange-50 border-orange-100',
];

function CheersSection() {
  const [cheers, setCheers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  const fetchCheers = async (pageNum, append = false) => {
    setLoading(true);
    try {
      const res = await getCheers({ page: pageNum, size: 5 });
      const newCheers = res.data.content || [];
      setCheers((prev) => append ? [...prev, ...newCheers] : newCheers);
      setHasMore(!res.data.last);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheers(0);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCheers(nextPage, true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await postCheer({ nickname: nickname.trim() || '익명의 취준생', content: trimmed });
      setNickname('');
      setContent('');
      setSubmitDone(true);
      setTimeout(() => setSubmitDone(false), 2500);
      setPage(0);
      fetchCheers(0);
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return '방금 전';
    if (mins < 60) return `${mins}분 전`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}일 전`;
    return new Date(dateStr).toLocaleDateString('ko-KR');
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <Heart size={22} className="text-rose-400 fill-rose-400" />
          취준생 응원 한마디
        </h2>
        <p className="text-sm text-gray-500 mt-2">힘든 취준 길, 서로 응원 한마디 남겨요. 당신의 한마디가 누군가에게 큰 힘이 됩니다.</p>
      </div>

      {/* 응원글 작성 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value.slice(0, 20))}
            placeholder="닉네임 (선택)"
            className="w-full sm:w-32 shrink-0 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none"
          />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            placeholder="따뜻한 응원 한마디를 남겨주세요..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="shrink-0 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            <Send size={14} />
            {submitting ? '보내는 중...' : '응원하기'}
          </button>
        </div>
        {submitDone && (
          <p className="text-sm text-rose-500 font-medium animate-fade-in-up">따뜻한 응원 감사합니다!</p>
        )}
        <p className="text-xs text-gray-400 text-right">{content.length}/500</p>
      </form>

      {/* 응원글 목록 */}
      {cheers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cheers.map((cheer, i) => (
            <div
              key={cheer.id}
              className={`p-4 rounded-xl border ${CHEER_COLORS[i % CHEER_COLORS.length]} transition-all hover:scale-[1.02]`}
            >
              <p className="text-sm text-gray-700 leading-relaxed mb-2">&ldquo;{cheer.content}&rdquo;</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">- {cheer.nickname}</span>
                <span className="text-xs text-gray-400">{timeAgo(cheer.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {cheers.length === 0 && !loading && (
        <div className="text-center py-8">
          <MessageCircle size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-400">아직 응원글이 없어요. 첫 번째 응원을 남겨주세요!</p>
        </div>
      )}

      {hasMore && cheers.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors flex items-center gap-1 mx-auto disabled:opacity-40"
          >
            <ChevronDown size={16} />
            {loading ? '불러오는 중...' : '응원글 더 보기'}
          </button>
        </div>
      )}
    </section>
  );
}

function HomePage() {
  const { isLoggedIn, isLoading, login: authLogin } = useAuth();

  // 비로그인 시 sessionStorage에서 검색 결과 복원
  const savedState = !isLoading && !isLoggedIn ? loadSessionState() : null;

  const [view, setView] = useState(isLoggedIn ? 'my-jobs' : 'search'); // 'my-jobs' | 'search'
  const [searchTab, setSearchTab] = useState('jobs'); // 'jobs' | 'activities'
  const [step, setStep] = useState(savedState?.step || 'input');
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('💻 개발');
  const [searchResults, setSearchResults] = useState(savedState?.searchResults || null);
  const [searchError, setSearchError] = useState(null);
  const [stats, setStats] = useState(null);
  const [showInAppBrowserModal, setShowInAppBrowserModal] = useState(false);

  const isInAppBrowser = () => {
    const ua = navigator.userAgent || '';
    return /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|everytime|SamsungBrowser\/\d.*Mobile VR/i.test(ua)
      || (ua.includes('wv') && ua.includes('Android'))
      || (window.webkit?.messageHandlers && !/Safari/i.test(ua));
  };

  // 로그인 시 현재 검색 조건을 저장한 뒤 OAuth로 이동
  const login = () => {
    if (isInAppBrowser()) {
      setShowInAppBrowserModal(true);
      return;
    }
    if (selectedTags.length > 0 || query.trim() !== '') {
      localStorage.setItem('pendingSearch', JSON.stringify({ tags: selectedTags, query }));
    }
    authLogin();
  };

  // 통계 로드
  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  // 로그인 완료 후 pendingSearch가 있으면 자동 재검색 (서버에 저장됨)
  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      const pending = localStorage.getItem('pendingSearch');
      if (pending) {
        localStorage.removeItem('pendingSearch');
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
        searchJobs({ tags: tags || [], query: q || '' })
          .then((res) => {
            setSearchResults(res.data);
            setStep('results');
          })
          .catch(() => {
            setView('my-jobs');
            setStep('input');
          });
        return;
      }
      setView('my-jobs');
    } else if (!isLoading && !isLoggedIn) {
      setView('search');
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
    if (selectedTags.length === 0) {
      setSearchError('관심 키워드를 최소 1개 이상 선택해주세요!');
      return;
    }

    // 하루 검색 횟수 제한: 비로그인 3회, 로그인 5회
    const limitSuffix = isJobSearch ? '' : 'Activity';
    const limitKey = isLoggedIn ? `${limitSuffix}searchLimitLoggedIn` : `${limitSuffix}searchLimit`;
    const maxCount = isLoggedIn ? 5 : 3;
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem(limitKey) || '{}');
    const count = stored.date === today ? stored.count : 0;
    if (count >= maxCount) {
      setSearchError(
        isLoggedIn
          ? '오늘 검색 횟수(5회)를 모두 사용했어요. 내일 다시 이용해주세요!'
          : '비로그인 상태에서는 하루 3번까지만 검색할 수 있어요. 로그인하면 하루 5번까지 검색할 수 있어요!'
      );
      return;
    }
    localStorage.setItem(limitKey, JSON.stringify({ date: today, count: count + 1 }));

    setStep('loading');
    setSearchError(null);

    try {
      const searchFn = isJobSearch ? searchJobs : searchActivities;
      const res = await searchFn({ tags: selectedTags, query });
      setSearchResults(res.data);
      setStep('results');
    } catch (err) {
      // 검색 실패 시 카운트 롤백
      const rollbackStored = JSON.parse(localStorage.getItem(limitKey) || '{}');
      const rollbackToday = new Date().toISOString().slice(0, 10);
      if (rollbackStored.date === rollbackToday && rollbackStored.count > 0) {
        localStorage.setItem(limitKey, JSON.stringify({ date: rollbackToday, count: rollbackStored.count - 1 }));
      }
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

  const handleSearchTabChange = (tab) => {
    setSearchTab(tab);
    setSelectedTags([]);
    setQuery('');
    setActiveCategory(tab === 'jobs' ? '💻 개발' : Object.keys(ACTIVITY_TAG_DATA)[0]);
    setSearchResults(null);
    setSearchError(null);
    setStep('input');
  };

  const currentTagData = searchTab === 'jobs' ? TAG_DATA : ACTIVITY_TAG_DATA;
  const currentPlaceholder = searchTab === 'jobs' ? PLACEHOLDER_DATA : ACTIVITY_PLACEHOLDER_DATA;
  const isJobSearch = searchTab === 'jobs';

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
      <Nav onLogoClick={() => {
        if (isLoggedIn) {
          setView('my-jobs');
          setStep('input');
        } else {
          setStep('input');
          setSearchResults(null);
          sessionStorage.removeItem('searchState');
        }
      }} />

      <main className={`w-full mx-auto mt-10 px-4 pb-12 flex-grow ${(view === 'search' || !isLoggedIn) && step === 'results' && searchResults ? 'max-w-6xl' : 'max-w-4xl'}`}>
        {/* 로그인 + 내 추천 공고 뷰 */}
        {isLoggedIn && view === 'my-jobs' && (
          <MyRecommendedJobs onGoSearch={goToSearch} onGoActivities={() => setView('my-activities')} />
        )}

        {/* 로그인 + 내 추천 대외활동 뷰 */}
        {isLoggedIn && view === 'my-activities' && (
          <MyRecommendedActivities onGoSearch={goToSearch} onGoJobs={() => setView('my-jobs')} />
        )}

        {/* 오늘의 추천 섹션 (비로그인 상단) */}
        {!isLoggedIn && step === 'input' && (
          <div className="mb-6">
            <RecommendationsSection isLoggedIn={isLoggedIn} onLoginRequired={login} />
          </div>
        )}

        {/* 검색 입력 뷰 */}
        {(view === 'search' || !isLoggedIn) && step === 'input' && (
          <div className="bg-white p-5 sm:p-10 rounded-2xl shadow-sm border border-gray-100 transition-all">
            {isLoggedIn && (
              <button
                onClick={() => setView('my-jobs')}
                className="text-sm text-blue-600 hover:underline flex items-center mb-6 font-medium gap-1"
              >
                ← 내 추천 공고로 돌아가기
              </button>
            )}

            <SearchTabs activeTab={searchTab} onTabChange={handleSearchTabChange} />

            <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
              {isJobSearch ? '제가 취준하려고 만든 AI 공고 검색기' : 'AI 대외활동 검색기'}
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {isJobSearch
                ? <>매번 채용 포털 뒤지기 너무 귀찮아서 주말에 직접 만들었습니다.<br/>직군 키워드 고르고, 원하는 조건을 대충 텍스트로 적어주시면 AI가 찰떡같이 찾아드려요!</>
                : <>공모전, 봉사활동, 서포터즈, 인턴십 등 대외활동을 AI가 찾아드려요!<br/>관심 분야 키워드를 고르고, 원하는 조건을 적어주세요.</>
              }
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
              <label className="block text-sm font-bold text-gray-700 mb-3">
                {isJobSearch ? '1. 관심 키워드 콕 집어주세요' : '1. 관심 분야 골라주세요'}
              </label>

              <div className="flex flex-wrap gap-2 mb-4 border-b border-gray-100 pb-4">
                {Object.keys(currentTagData).map((category) => (
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
                {(currentTagData[activeCategory] || []).map((tag) => (
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
              <label className="block text-sm font-bold text-gray-700 mb-3">
                {isJobSearch ? '2. AI한테 속마음 말하기 (그냥 편하게 적으세요!)' : '2. 원하는 활동 조건을 적어주세요'}
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value.slice(0, 500))}
                maxLength={500}
                placeholder={currentPlaceholder[activeCategory]}
                className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-shadow text-sm"
              />
              <p className={`text-xs mt-1 text-right ${query.length >= 500 ? 'text-red-500' : 'text-gray-400'}`}>
                {query.length}/500
              </p>
            </div>

            <button
              onClick={handleSearch}
              disabled={selectedTags.length === 0}
              className={`w-full font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-sm ${
                selectedTags.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Search size={20} />
              <span>{selectedTags.length > 0 ? `${selectedTags.length}개 키워드로 ` : ''}내 조건에 맞는 {isJobSearch ? '공고' : '활동'} 찾아보기</span>
            </button>

            {!isLoggedIn && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 flex flex-col sm:flex-row items-center justify-center gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <Bell size={14} className="text-blue-500" />
                    매일 접속해서 검색하기 귀찮으신가요?
                  </span>
                  <button onClick={login} className="text-blue-600 font-bold hover:underline">
                    로그인하고 새 {isJobSearch ? '공고' : '활동'} 알아서 배달받기
                  </button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* 로딩 */}
        {(view === 'search' || !isLoggedIn) && step === 'loading' && (
          <div className="flex flex-col items-center justify-center h-80 space-y-4">
            <div className="char-loading w-40 h-40 drop-shadow-lg">
              <img src="/char-standing.png" alt="검색 중" className="w-full h-full" />
              <img src="/char-sitting.png" alt="" className="w-full h-full" />
            </div>
            <p className="text-gray-600 font-medium animate-pulse">AI가 열심히 {isJobSearch ? '공고를 뒤지는' : '활동을 찾는'} 중입니다... 잠시만요!</p>
          </div>
        )}

        {/* 검색 결과 */}
        {(view === 'search' || !isLoggedIn) && step === 'results' && searchResults && (
          <div className="animate-fade-in-up flex gap-6 items-start">
            {/* 결과 목록 */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 flex items-center gap-2">
                    짜잔! AI가 찾은 추천 {isJobSearch ? '공고' : '활동'} <img src="/char-standing.png" alt="" className="w-14 h-14 sm:w-16 sm:h-16 inline-block" />
                  </h2>
                  <p className="text-sm text-gray-500">
                    총 {searchResults.totalCount}개 중 매칭률 높은 {isJobSearch ? '공고를' : '활동을'} 뽑았어요.
                    {searchResults.newTodayCount > 0 && (
                      <span className="ml-2 text-blue-600 font-medium">오늘 새로 올라온 {isJobSearch ? '공고' : '활동'} {searchResults.newTodayCount}개!</span>
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
                {isJobSearch && searchResults.jobs?.map((job) => (
                  <div key={job.id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
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
                    <div className="flex items-center gap-3 mt-4">
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        공고 보러가기 <ExternalLink size={14} />
                      </a>
                      <SaveBookmarkButton jobListingId={job.id} isLoggedIn={isLoggedIn} onLoginRequired={login} />
                    </div>
                  </div>
                ))}
                {!isJobSearch && searchResults.activities?.map((activity) => (
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
                      이 조건 그대로, 내일부터 매일 배달해 드릴까요? 💌
                    </h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      매일 들어와서 검색할 필요 없어요! 한 번만 로그인해 두시면,<br className="hidden md:block"/>
                      제가 <strong>매일 아침 새로 올라온 맞춤 {isJobSearch ? '공고만' : '활동만'} 쏙쏙 골라서</strong> 알려드릴게요.
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

              {/* 모바일 전용 - 개발자에게 커피 사주기 */}
              <CoffeeMobile />
            </div>

            {/* 사이드 - 개발자에게 커피 사주기 (데스크톱) */}
            <CoffeeSide />
          </div>
        )}

      </main>

      {/* 응원글 섹션 */}
      <CheersSection />

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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/bookmarks" element={<BookmarksPage />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}
