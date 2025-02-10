import { useState } from "react";
import "@/css/admin/AdminpageMain.css";
import AdminAside from "./AdminAside";
import MemberManager from "./MemberManager";

const AdminpageMain = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  return (
    <div className="admin-container">
      {/* 사이드바 - 클릭 시 페이지 변경 */}
      <AdminAside setSelectedPage={setSelectedPage} />

      {/* 콘텐츠 영역 */}
      <article className="admin-content">
        {selectedPage === "dashboard" && (
          <div>
            <h2>관리자 대시보드</h2>
            <p>현재 준비 중인 관리자 페이지입니다.</p>
          </div>
        )}
        {selectedPage === "members" && <MemberManager />}
      </article>
    </div>
  );
};

export default AdminpageMain;
