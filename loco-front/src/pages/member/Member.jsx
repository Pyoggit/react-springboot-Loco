import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Home from "./Home";

const Loading = <div>Loading...</div>;
const SignUp = lazy(() => import("@/components/member/Sign/SignUpForm"));
const KakaoLogin = lazy(() => import("@/components/member/Sign/KakaoLoginBtn"));
const GoogleLogin = lazy(() =>
  import("@/components/member/Sign/GoogleLoginBtn")
);
const Login = lazy(() => import("@/components/member/Sign/LoginForm"));

const Member = () => {
  return (
    <Suspense fallback={Loading}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/kakaoLogin" element={<KakaoLogin />} />
        <Route path="/googleLogin" element={<GoogleLogin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Suspense>
  );
};

export default Member;
