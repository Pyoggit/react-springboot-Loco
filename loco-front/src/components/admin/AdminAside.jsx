import "@/css/admin/AdminAside.css";

const AdminAside = ({ setSelectedPage }) => {
  return (
    <aside className="admin-aside">
      <h2>관리자 페이지</h2>
      <ul>
        <li onClick={() => setSelectedPage("dashboard")}>대시보드</li>
        <li onClick={() => setSelectedPage("members")}>회원 관리</li>
        {/* <li onClick={() => setSelectedPage("intro")}>페이지 소개 관리</li> */}
        <li onClick={() => setSelectedPage("notice")}>공지사항 관리</li>
        <li onClick={() => setSelectedPage("freeboard")}>자유게시판 관리</li>
        <li onClick={() => setSelectedPage("faq")}>FAQ 관리</li>
        <li onClick={() => setSelectedPage("qna")}>Q&A 관리</li>
        <li onClick={() => setSelectedPage("circles")}>모임/참여 관리</li>
        <li onClick={() => setSelectedPage("market")}>중고거래 상품 관리</li>
        <li onClick={() => setSelectedPage("pay")}>매출 & 정산 관리</li>
        <li onClick={() => setSelectedPage("customer")}>고객센터 관리</li>
      </ul>
    </aside>
  );
};

export default AdminAside;
