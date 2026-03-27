import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          👀 공고줍줍
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <p className="text-gray-500">시행일: 2026년 3월 27일</p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. 개인정보의 처리 목적</h2>
            <p>공고줍줍(이하 "서비스")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>회원 가입 및 관리: 소셜 로그인을 통한 회원 식별, 서비스 이용 자격 확인</li>
              <li>서비스 제공: AI 기반 맞춤 채용 공고 검색 및 추천</li>
              <li>서비스 개선: 서비스 이용 통계 분석 및 품질 개선</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. 수집하는 개인정보 항목</h2>
            <p>서비스는 Google 소셜 로그인을 통해 다음의 개인정보를 수집합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>필수 항목:</strong> 이름, 이메일 주소, 프로필 이미지 URL (Google 계정 공개 정보)</li>
              <li><strong>자동 수집 항목:</strong> 검색 키워드, 검색 조건, 서비스 이용 기록</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. 개인정보의 처리 및 보유 기간</h2>
            <p>서비스는 법령에 따른 개인정보 보유 및 이용 기간 또는 이용자로부터 개인정보를 수집 시에 동의받은 개인정보 보유 및 이용 기간 내에서 개인정보를 처리 및 보유합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>회원 정보: 회원 탈퇴 시까지</li>
              <li>검색 기록: 최종 이용일로부터 1년</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. 개인정보의 제3자 제공</h2>
            <p>서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. 개인정보의 파기 절차 및 방법</h2>
            <p>서비스는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>전자적 파일: 복구 및 재생이 불가능한 방법으로 영구 삭제</li>
              <li>기록물, 인쇄물 등: 분쇄하거나 소각하여 파기</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. 이용자의 권리와 행사 방법</h2>
            <p>이용자는 개인정보 주체로서 다음과 같은 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>개인정보 열람 요구</li>
              <li>오류 등이 있을 경우 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
            </ul>
            <p className="mt-2">위 권리 행사는 아래 연락처를 통해 서면, 이메일 등으로 하실 수 있으며, 서비스는 이에 대해 지체 없이 조치하겠습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. 개인정보의 안전성 확보 조치</h2>
            <p>서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>개인정보의 암호화: 비밀번호 등 중요 정보는 암호화하여 저장 및 관리</li>
              <li>접근 통제: 개인정보에 대한 접근 권한을 최소한으로 제한</li>
              <li>보안 프로그램 설치 및 주기적 갱신</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. 쿠키(Cookie)의 사용</h2>
            <p>서비스는 별도의 쿠키를 사용하지 않습니다. 인증 토큰은 브라우저의 localStorage에 저장되며, 로그아웃 시 즉시 삭제됩니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. 개인정보 보호책임자</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>이메일: <a href="mailto:sese2204@gmail.com" className="text-blue-600 hover:underline">sese2204@gmail.com</a></li>
            </ul>
            <p className="mt-2">개인정보 처리에 관한 불만이나 피해구제 등에 관한 사항은 개인정보침해신고센터(privacy.kisa.or.kr, 118)에 문의하실 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. 개인정보처리방침의 변경</h2>
            <p>이 개인정보처리방침은 2026년 3월 27일부터 적용됩니다. 변경 사항이 있을 경우 서비스 내 공지를 통해 안내드리겠습니다.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
