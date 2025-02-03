import { Link, Route, Routes } from "react-router-dom";
import ModifyMember from "./ModifyMember";
import DeleteMember from "./DeleteMember";
import "@/css/member/mypage/MypageMain.css";

const MypageMain = () => {
  return (
    <div className="mypage-container">
      <aside className="mypage-aside">
        <h2>마이페이지</h2>
        <ul>
          <li>
            <Link to="/mypage/groups">참여한 모임</Link>
          </li>
          <li>
            <Link to="/mypage/posts">내가 쓴 글</Link>
          </li>
          <li>
            <Link to="/mypage/comments">내가 쓴 댓글</Link>
          </li>
          <li>
            <Link to="/mypage/cart">장바구니</Link>
          </li>
          <li>
            <Link to="/mypage/modify">회원 정보 수정</Link>
          </li>
          <li>
            <Link to="/mypage/delete">회원 탈퇴</Link>
          </li>
        </ul>
      </aside>

      <article className="mypage-content">
        <Routes>
          <Route path="/modify" element={<ModifyMember />} />
          <Route path="/delete" element={<DeleteMember />} />
          <Route path="/*" element={<div>선택한 내용 표시</div>} />
        </Routes>
      </article>
    </div>
  );
};

export default MypageMain;
