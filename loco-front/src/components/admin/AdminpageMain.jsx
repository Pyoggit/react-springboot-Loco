// import { useState } from "react";
// import "@/css/admin/AdminpageMain.css";
// import AdminAside from "./AdminAside";
// import MemberManager from "./MemberManager";

// const AdminpageMain = () => {
//   const [selectedPage, setSelectedPage] = useState("dashboard");

//   return (
//     <div className="admin-container">
//       {/* 사이드바 - 클릭 시 페이지 변경 */}
//       <AdminAside setSelectedPage={setSelectedPage} />

//       {/* 콘텐츠 영역 */}
//       <article className="admin-content">
//         {selectedPage === "dashboard" && (
//           <div>
//             <h2>관리자 대시보드</h2>
//             <p>현재 준비 중인 관리자 페이지입니다.</p>
//           </div>
//         )}
//         {selectedPage === "members" && <MemberManager />}
//       </article>
//     </div>
//   );
// };

// export default AdminpageMain;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/admin/AdminpageMain.css";
import AdminAside from "./AdminAside";
import MemberManager from "./MemberManager";

const AdminpageMain = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 이동
      return;
    }

    // JWT 디코딩해서 role 체크
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));

      if (tokenPayload.role !== "ROLE_ADMIN") {
        alert("관리자만 접근 가능합니다.");
        // navigate("/403"); // 접근 금지 페이지로 이동
        navigate("/"); // 접근 금지 페이지로 이동
      }
    } catch (error) {
      console.error("JWT 파싱 오류:", error);
      navigate("/login"); // JWT 문제 있으면 로그인 페이지로 이동
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      <AdminAside setSelectedPage={setSelectedPage} />
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
