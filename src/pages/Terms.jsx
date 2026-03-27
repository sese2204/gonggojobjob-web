import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight flex items-center gap-2 hover:opacity-80 transition-opacity">
          👀 공고줍줍
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-sm leading-relaxed text-gray-700">
          <p className="text-gray-500">시행일: 2026년 3월 27일</p>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제1조 (목적)</h2>
            <p>이 약관은 공고줍줍(이하 "서비스")이 제공하는 AI 기반 채용 공고 검색 서비스의 이용 조건 및 절차, 이용자와 서비스 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제2조 (정의)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>"서비스"란 공고줍줍이 제공하는 AI 기반 채용 공고 검색 및 추천 서비스를 말합니다.</li>
              <li>"이용자"란 서비스에 접속하여 이 약관에 따라 서비스가 제공하는 기능을 이용하는 자를 말합니다.</li>
              <li>"회원"이란 서비스에 Google 소셜 로그인을 통해 가입한 이용자를 말합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.</li>
              <li>서비스는 합리적인 사유가 발생할 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지를 통해 안내합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제4조 (회원가입)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>회원가입은 Google 소셜 로그인을 통해 이루어집니다.</li>
              <li>서비스는 Google로부터 제공받은 정보(이름, 이메일, 프로필 이미지)를 이용하여 회원 계정을 생성합니다.</li>
              <li>회원가입 시 이 약관 및 개인정보처리방침에 동의한 것으로 간주합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제5조 (서비스의 내용)</h2>
            <p>서비스는 다음과 같은 기능을 제공합니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>AI 기반 맞춤 채용 공고 검색</li>
              <li>검색 기록 저장 및 추천 공고 관리</li>
              <li>비회원 채용 공고 검색 (로그인 없이 이용 가능)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제6조 (서비스의 제공 및 변경)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다. 다만, 시스템 점검 등의 사유로 일시 중단될 수 있습니다.</li>
              <li>서비스는 무료로 제공되며, 향후 유료 서비스가 추가될 경우 별도로 안내합니다.</li>
              <li>서비스의 내용은 운영상, 기술상의 필요에 따라 변경될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제7조 (이용자의 의무)</h2>
            <p>이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>타인의 개인정보를 도용하는 행위</li>
              <li>서비스에 게시된 정보를 변경하거나, 서비스를 이용하여 얻은 정보를 서비스의 사전 승낙 없이 상업적으로 이용하는 행위</li>
              <li>서비스의 운영을 방해하거나 안정성을 저해하는 행위</li>
              <li>자동화된 수단(봇, 크롤러 등)을 이용하여 서비스에 과도한 부하를 주는 행위</li>
              <li>기타 관계 법령에 위배되는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제8조 (면책 조항)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>서비스는 AI 기술을 활용한 채용 공고 검색 및 추천 서비스로, 검색 결과의 정확성이나 완전성을 보장하지 않습니다.</li>
              <li>서비스를 통해 제공되는 채용 공고 정보는 각 채용 사이트의 정보를 기반으로 하며, 실제 채용 조건은 해당 기업에 직접 확인하시기 바랍니다.</li>
              <li>서비스는 이용자가 서비스를 이용하여 기대하는 결과를 얻지 못하거나 손해가 발생한 경우에 대해 책임을 지지 않습니다.</li>
              <li>천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제9조 (회원 탈퇴 및 자격 상실)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>회원은 언제든지 서비스에 탈퇴를 요청할 수 있으며, 서비스는 즉시 회원 탈퇴를 처리합니다.</li>
              <li>탈퇴 시 회원의 개인정보 및 검색 기록은 개인정보처리방침에 따라 처리됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제10조 (분쟁 해결)</h2>
            <ul className="list-decimal pl-5 space-y-1">
              <li>서비스와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법을 적용합니다.</li>
              <li>서비스 이용과 관련하여 분쟁이 발생한 경우, 양측은 원만한 해결을 위해 성실히 협의합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">제11조 (문의)</h2>
            <p>서비스 이용에 관한 문의는 아래 연락처로 해주시기 바랍니다.</p>
            <ul className="list-disc pl-5 mt-2">
              <li>이메일: <a href="mailto:sese2204@gmail.com" className="text-blue-600 hover:underline">sese2204@gmail.com</a></li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
