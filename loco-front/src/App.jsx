import { Route, Routes } from "react-router-dom";
import "./App.css";
import Container from "./layouts/Container";
import Member from "./pages/member/Member";
import AdminLoginMain from "./components/admin/AdminLogin/AdminLoginMain";
import LoginMain from "./components/member/Sign/LoginForm";
import KakaoCallback from "./components/member/Sign/KakaoCallback";
import SignUp from "./components/member/Sign/SignUpForm";
import ModifyMember from "./components/member/Mypage/ModifyMember";
import DeleteMember from "./components/member/Mypage/DeleteMember";
import MypageMain from "./components/member/Mypage/MypageMain";
import BusinesspageMain from "./components/member/Mypage/BusinesspageMain";
import AdminpageMain from "./components/member/Mypage/AdminpageMain";

function App() {
  return (
    <Routes>
      <Route element={<Container />}>
        <Route path="/*" element={<Member />} />
        <Route path="/admin/login" element={<AdminLoginMain />} />
        <Route path="/member/Sign/LoginMain" element={<LoginMain />} />
        <Route path="/member/Sign/signup" element={<SignUp />} />
        <Route path="/auth/kakao" element={<KakaoCallback />} />
        <Route path="/user/:email/modify" element={<ModifyMember />} />
        <Route path="/user/:email/delete" element={<DeleteMember />} />
        <Route path="/mypage/*" element={<MypageMain />} />
        <Route path="/businesspage/*" element={<BusinesspageMain />} />
        <Route path="/adminpage/*" element={<AdminpageMain />} />
        <Route path="*" element={<h1> 404 Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
