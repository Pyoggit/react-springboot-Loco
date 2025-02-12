import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginBtn from "./KakaoLoginBtn";
import GoogleLoginBtn from "./GoogleLoginBtn";
import axios from "@/utils/AxiosConfig";
import { useCookies } from "react-cookie";
import "@/css/member/sign/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["loginUser"]);

  /** 로그인 처리 함수 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 입력값 다듬기
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    try {
      // 로그인 API 호출 (일반 유저용)
      const response = await axios.post("/api/users/login", {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // 응답 데이터 및 헤더에서 토큰, 유저 정보 추출
      const accessToken = response.headers["authorization"]?.split(" ")[1];
      const refreshToken = response.headers["refresh-token"];
      const userInfo = response.data;

      // 유효한 토큰과 사용자 정보가 없는 경우 예외 처리
      if (!accessToken || !userInfo) {
        throw new Error("JWT 토큰 또는 유저 정보를 가져오지 못했습니다!");
      }

      // 관리자 로그인과의 충돌 방지를 위해 관리자 토큰 제거 (필요한 경우)
      localStorage.removeItem("admin_accessToken");
      // 일반 유저 토큰 저장
      localStorage.setItem("일반로그인 accessToken", accessToken);
      localStorage.setItem(
        "일반로그인 refreshToken(쿠키로 가야함)",
        refreshToken
      );
      setCookie("loginUser", userInfo, { path: "/" });

      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
        setError("아이디 또는 비밀번호를 확인하세요.");
        setPassword("");
        passwordInputRef.current.focus();
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="normal-login-form">
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailInputRef}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="social-login-btn">
          <p>또는</p>
          <KakaoLoginBtn />
          <GoogleLoginBtn />
        </div>

        <div className="find-email-pw">
          <div className="find-email" onClick={() => navigate("/find/email")}>
            이메일 찾기
          </div>
          <div className="find-pw" onClick={() => navigate("/find/pw")}>
            비밀번호 찾기
          </div>
        </div>

        <div className="signup-link" onClick={() => navigate("/signup")}>
          회원가입
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
