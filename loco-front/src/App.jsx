import { Route, Routes } from "react-router-dom";
import "./App.css";
import Member from "./pages/member/Member";
import AdminLoginMain from "./components/admin/AdminLoginMain";
import LoginMain from "./components/member/Sign/LoginForm";
import FindEmailForm from "./components/member/Sign/FindEmailForm";
import FindPwForm from "./components/member/Sign/FindPwForm";
import FindPwVerify from "./components/member/Sign/FindPwVerify";
import FindPwResult from "./components/member/Sign/FindPwResult";
import SendPwResult from "./components/member/Sign/SendPwResult";
import KakaoCallback from "./components/member/Sign/KakaoCallback";
import SignUp from "./components/member/Sign/SignUpForm";
import ModifyMember from "./components/member/Mypage/ModifyMember";
import DeleteMember from "./components/member/Mypage/DeleteMember";
import FindEmailResult from "./components/member/Sign/FindEmailResult";
import MypageMain from "./components/member/Mypage/MypageMain";
import Admin from "./pages/admin/Admin";
import ResignKakaoUser from "./components/member/Sign/ResignKakaoUser";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Member />} />
      <Route path="/adminpage/*" element={<Admin />} />
      <Route path="/adminpage/login" element={<AdminLoginMain />} />
      <Route path="/login" element={<LoginMain />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/resign-kakao" element={<ResignKakaoUser />} />

      <Route path="/find/email" element={<FindEmailForm />} />
      <Route path="/find/email/result" element={<FindEmailResult />} />
      <Route path="/find-password" element={<FindPwForm />} />
      <Route path="/find-password/verify" element={<FindPwVerify />} />
      <Route path="/find-password/result" element={<FindPwResult />} />

      {/* 카카오로그인 콜백처리 */}
      <Route path="/kakao-callback" element={<KakaoCallback />} />

      <Route path="*" element={<h1> 404 Not Found</h1>} />

      <Route path="/auth/kakao" element={<KakaoCallback />} />
      <Route path="/user/:email/modify" element={<ModifyMember />} />
      <Route path="/user/:email/delete" element={<DeleteMember />} />
    </Routes>
  );
}

export default App;
