import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🚫 접근 금지</h1>
      <p>관리자만 접근 가능한 페이지입니다.</p>
      <button onClick={() => navigate("/")}>홈으로 돌아가기</button>
    </div>
  );
};

export default ForbiddenPage;
