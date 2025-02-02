import { Link, Route, Routes } from "react-router-dom";
import ModifyMember from "./ModifyMember";
import DeleteMember from "./DeleteMember";
import "@/css/member/mypage/BusinesspageMain.css";

const BusinessPageMain = () => {
  return (
    <div className="business-container">
      <aside className="business-aside">
        <h2>사업자페이지</h2>
        <ul>
          <li>
            <Link to="/businesspage/products">상품 관리</Link>
          </li>
          <li>
            <Link to="/businesspage/orders">주문 관리</Link>
          </li>
          <li>
            <Link to="/businesspage/customers">고객 관리</Link>
          </li>
          <li>
            <Link to="/businesspage/sales">매출 & 정산</Link>
          </li>
          <li>
            <Link to="/businesspage/modify">사업자 정보 수정</Link>
          </li>
          <li>
            <Link to="/businesspage/delete">사업자 탈퇴</Link>
          </li>
        </ul>
      </aside>

      <article className="business-content">
        <Routes>
          <Route path="/modify" element={<ModifyMember />} />
          {/* 사업자 탈퇴는 ... 어드민 수락 기능??????????? */}
          <Route path="/delete" element={<DeleteMember />} />
          <Route path="/*" element={<div> 선택한 내용 표시</div>} />
        </Routes>
      </article>
    </div>
  );
};

export default BusinessPageMain;
