// 파일명: src/components/admin/AdminpageMain.jsx
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
    // 수정: 일반 accessToken이 아니라 admin_accessToken을 확인
    const accessToken = localStorage.getItem("admin_accessToken");

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 또는 관리자 전용 로그인 페이지로 이동
      return;
    }

    // JWT 디코딩하여 role 확인
    try {
      const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
      if (tokenPayload.role !== "ROLE_ADMIN") {
        alert("관리자만 접근 가능합니다.");
        navigate("/"); // 접근 금지 시 홈 또는 다른 페이지로 이동
      }
    } catch (error) {
      console.error("JWT 파싱 오류:", error);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-container">
      <AdminAside setSelectedPage={setSelectedPage} />
      <article className="admin-content">
        {selectedPage === "dashboard" && <StatDashboard />}

        {selectedPage === "members" && <MemberManager />}
        {selectedPage === "notice" && <NoticeManager />}
        {selectedPage === "freeboard" && <FreeboardManager />}
        {selectedPage === "faq" && <FaqManager />}
        {selectedPage === "qna" && <QnaManager />}
        {selectedPage === "circles" && <CircleManager />}
        {selectedPage === "market" && <ProductManager />}
        {selectedPage === "pay" && <PayManager />}
      </article>
    </div>
  );
};

export default AdminpageMain;
