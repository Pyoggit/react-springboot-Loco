import { Link, Route, Routes } from 'react-router-dom';
import MypageCircle from './MypageCircle';
import MypageBoard from './MypageBoard';
import MypageComment from './MypageComment';
import MypageOrder from './MypageOrder';
import ModifyMember from './ModifyMember';
import DeleteMember from './DeleteMember';
import MypageProduct from './MypageProduct';
import '@/css/member/mypage/MypageMain.css';

const MypageMain = () => {
  return (
    <div className="mypage-container">
      <aside className="mypage-aside">
        <h2>마이페이지</h2>
        <ul>
          <li>
            <Link to="/mypage/circle">참여한 모임</Link>
          </li>
          <li>
            <Link to="/mypage/board">내가 쓴 글</Link>
          </li>
          <li>
            <Link to="/mypage/comment">내가 쓴 댓글</Link>
          </li>
          <li>
            <Link to="/mypage/product">판매 중인 상품</Link>
          </li>
          <li>
            <Link to="/mypage/order">주문내역</Link>
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
          <Route path="/circle" element={<MypageCircle />} />
          <Route path="/board" element={<MypageBoard />} />
          <Route path="/comment" element={<MypageComment />} />
          <Route path="/order" element={<MypageOrder />} />
          <Route path="/modify" element={<ModifyMember />} />
          <Route path="/delete" element={<DeleteMember />} />
          <Route path="/product" element={<MypageProduct />} />
          <Route path="/*" element={<div>미작성한 mypage 컴포넌트</div>} />
        </Routes>
      </article>
    </div>
  );
};

export default MypageMain;
