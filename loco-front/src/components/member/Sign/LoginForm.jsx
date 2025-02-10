import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginBtn from "./KakaoLoginBtn";
import GoogleLoginBtn from "./GoogleLoginBtn";
import axios from "axios";
import "@/css/member/sign/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Attempt:", { email, password });
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email,
          password,
        }
      );

      // JWT 액세스 토큰 저장
      localStorage.setItem("accessToken", response.data.accessToken);

      // 로그인 성공 후 메인 페이지 또는 대시보드로 이동
      alert("로그인 성공!");
      navigate("/");
    } catch (error) {
      setError("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  const onSignUpClick = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };

  const onFindEmailClcik = () => {
    navigate("/find/email");
  };

  const onFindPwClcik = () => {
    navigate("/find/pw");
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
                required
              />
            </div>

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
          <div className="find-email" onClick={onFindEmailClcik}>
            이메일 찾기
          </div>
          <div className="find-pw" onClick={onFindPwClcik}>
            비밀번호 찾기
          </div>
        </div>

        <div className="signup-link" onClick={onSignUpClick}>
          회원가입
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
