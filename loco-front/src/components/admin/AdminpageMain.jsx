import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/admin/AdminpageMain.css";
import AdminAside from "./AdminAside";
import MemberManager from "./MemberManager";
import NoticeManager from "./NoticeManager";
import CircleManager from "./CIrcleManager";
import FaqManager from "./FaqManager";
import FreeboardManager from "./FreeboardManager";
import PayManager from "./PayManager";
import QnaManager from "./QnaManager";
import ProductManager from "./ProductManager";
import StatDashboard from "./StatDashboard";

const AdminpageMain = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 수정: 'admin_accessToken' → 'admin_token' 으로 변경
    const accessToken = localStorage.getItem("admin_token");

    if (!accessToken) {
      alert("❌ 관리자 로그인이 필요합니다.");
      navigate("/adminpage/login"); // ✅ 관리자 로그인 페이지로 이동
      return;
    }

    // ✅ JWT 디코딩하여 role 확인
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));

      if (!tokenPayload.role || !tokenPayload.role.includes("ADMIN")) {
        alert("❌ 관리자 권한이 없습니다.");
        navigate("/"); // ✅ 접근 금지 시 홈 또는 다른 페이지로 이동
        return;
      }
    } catch (error) {
      console.error("🚨 JWT 파싱 오류:", error);
      alert("❌ 잘못된 토큰입니다. 다시 로그인하세요.");
      localStorage.removeItem("admin_token"); // ✅ 잘못된 토큰 삭제
      navigate("/adminpage/login"); // ✅ 로그인 페이지로 이동
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      <AdminAside setSelectedPage={setSelectedPage} />
      <article className="admin-content">
        {selectedPage === "dashboard" && <StatDashboard />}
        {selectedPage === "members" && <MemberManager />}
        {selectedPage === "freeboard" && <FreeboardManager />}
        {selectedPage === "notice" && <NoticeManager />}
        {selectedPage === "faq" && <FaqManager />}
        {selectedPage === "circles" && <CircleManager />}
        {selectedPage === "market" && <ProductManager />}
        {selectedPage === "pay" && <PayManager />}
      </article>
    </div>
  );
};

export default AdminpageMain;
