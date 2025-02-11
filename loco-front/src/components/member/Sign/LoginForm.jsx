import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginBtn from "./KakaoLoginBtn";
import GoogleLoginBtn from "./GoogleLoginBtn";
import axios from "@/utils/axiosConfig";
import "@/css/member/sign/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const emailInputRef = useRef(null); // 이메일 입력창 Ref
  const passwordInputRef = useRef(null); // 비밀번호 입력창 Ref
  const navigate = useNavigate();

  /** 로그인 처리 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Attempt:", { email, password });
    setError("");

    try {
      const response = await axios.post("/api/users/login", {
        email,
        password,
      });

      // 백엔드 응답 헤더에서 Authorization 값 가져오기
      const accessToken = response.headers["authorization"]?.split(" ")[1];
      const refreshToken = response.headers["refresh-token"];

      console.log("응답 헤더 확인:", response.headers);
      console.log("받은 일반로그인_AccessToken:", accessToken);
      console.log("받은 일반로그인_RefreshToken:", refreshToken);

      if (accessToken) {
        localStorage.setItem("일반로그인_accessToken", accessToken);
        localStorage.setItem("일반로그인_refreshToken", refreshToken);
        alert("로그인 성공!");
        navigate("/");
      } else {
        throw new Error("JWT 토큰을 가져오지 못했습니다!");
      }
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);

      // 아이디 또는 비밀번호가 틀린 경우
      if (error.response?.status === 401) {
        alert("아이디 또는 비밀번호가 틀렸습니다.");
        setError("아이디 또는 비밀번호를 확인하세요.");
        setPassword(""); // 비밀번호 초기화
        passwordInputRef.current.focus(); // 비밀번호 입력창으로 포커스 이동
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
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
                ref={emailInputRef} // Ref 추가
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
                ref={passwordInputRef} // Ref 추가
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="login-btn">
              로그인
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
