import { Link, Route, Routes } from "react-router-dom";
import "@/css/admin/AdminpageMain.css";

const AdminpageMain = () => {
  return (
    <div className="admin-container">
      <aside className="admin-aside">
        <h2>관리자 페이지</h2>
        <ul>
          <li>
            <Link to="/adminpage/members">회원 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/business">사업자 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/intro">페이지 소개 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/notice">공지사항 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/board">게시판 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/comment">댓글 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/groups">모임/참여 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/shop">공구몰 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/revenue">매출 & 정산 관리</Link>
          </li>
          <li>
            <Link to="/adminpage/customer">고객센터 관리</Link>
          </li>
        </ul>
      </aside>

      <article className="admin-content">
        <Routes>
          <Route path="/*" element={<div> 미작성한 adminpage 컴포넌트</div>} />
        </Routes>
      </article>
    </div>
  );
};

export default AdminpageMain;
