import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search, Bookmark, ChevronRight, CheckCircle2, X, Database, Briefcase, Coffee, Bell, Mail, LogOut, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { searchJobs } from './api/jobs';
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
  '💻 개발': '예: 대용량 트래픽 다뤄볼 수 있는 서버 개발자 자리 없나? 유연근무제면 더 좋고!',
  '🎨 기획/디자인': '예: 데이터 보면서 프로덕트 개선하는 PM 직무 찾아요. 판교나 강남 출퇴근 희망!',
  '📈 마케팅/비즈니스': '예: 퍼포먼스 마케팅이랑 데이터 분석 같이 할 수 있는 곳. 수평적인 분위기 원함!',
  '💼 경영/사무/인사': '예: 채용부터 평가보상까지 해볼 수 있는 HR 직무. 워라밸 보장되는 중견기업 이상!',
  '🤝 영업/고객상담': '예: B2B 해외영업 경험 살릴 수 있는 곳. 영어 많이 쓰는 글로벌 기업 찾음!',
  '📝 미디어/홍보': '예: 기업 인스타나 유튜브 기획해본 경험 있음. 트렌디하고 자유로운 회사 가고 싶다!'
};

function HomePage() {
  const { isLoggedIn, isLoading, user, login, logout } = useAuth();
  const [step, setStep] = useState('input');
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('💻 개발');
  const [searchResults, setSearchResults] = useState(null);
  const [searchError, setSearchError] = useState(null);

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
        <div className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2">
          👀 공고줍줍
        </div>
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

      <main className="max-w-4xl w-full mx-auto mt-10 px-4 pb-12 flex-grow">
        {step === 'input' && (
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 transition-all">
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

        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center h-80 space-y-5">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 font-medium animate-pulse">AI가 열심히 공고를 뒤지는 중입니다... 잠시만요! 🏃💨</p>
          </div>
        )}

        {step === 'results' && searchResults && (
          <div className="animate-fade-in-up">
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
                onClick={() => setStep('input')}
                className="text-sm text-blue-600 hover:underline flex items-center bg-blue-50 px-3 py-1.5 rounded-lg font-medium"
              >
                조건 다시 쓰기 <ChevronRight size={16} />
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
                    <button className="text-gray-300 hover:text-blue-500 transition-colors">
                      <Bookmark size={24} />
                    </button>
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
        )}
      </main>

      <footer className="bg-gray-900 py-6 mt-8 shrink-0">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12">
            <div className="flex items-center space-x-3 text-gray-300">
              <Database size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                제가 긁어모은 누적 공고 <strong className="text-white text-lg ml-1">142,853</strong>개
              </span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-700"></div>
            <div className="flex items-center space-x-3 text-gray-300">
              <Briefcase size={20} className="text-blue-400" />
              <span className="text-sm font-medium">
                오늘 봇이 새로 주워온 공고 <strong className="text-white text-lg ml-1">1,245</strong>개
              </span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-5 flex items-center justify-center gap-1">
            <Coffee size={14} /> 공고줍줍은 매일 새벽 제 서버가 열심히 돌아가며 데이터를 모으고 있어요. 세상의 모든 취준생 화이팅!
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
