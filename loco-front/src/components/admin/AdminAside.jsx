import "@/css/admin/AdminAside.css";

const AdminAside = ({ setSelectedPage }) => {
  return (
    <aside className="admin-aside">
      <h2>관리자 페이지</h2>
      <ul>
        <li onClick={() => setSelectedPage("dashboard")}>대시보드</li>
        <li onClick={() => setSelectedPage("members")}>회원 관리</li>
        <li onClick={() => setSelectedPage("freeboard")}>게시판 관리</li>
        <li onClick={() => setSelectedPage("notice")}>댓글 관리</li>
        <li onClick={() => setSelectedPage("faq")}>FAQ 관리</li>
        <li onClick={() => setSelectedPage("circles")}>모임/참여 관리</li>
        <li onClick={() => setSelectedPage("market")}>중고거래 상품 관리</li>
        <li onClick={() => setSelectedPage("pay")}>매출 & 정산 관리</li>
      </ul>
    </aside>
  );
};

export default AdminAside;
