import { Route, Routes } from "react-router-dom";
import AdminpageMain from "../../components/member/Mypage/AdminpageMain";

const Admin = () => {
  return (
    <>
      <h1>관리자모드 렌더링 할 페이지</h1>
      <Routes>
        <Route path="/" element={<AdminpageMain />} />
      </Routes>
    </>
  );
};

export default Admin;
