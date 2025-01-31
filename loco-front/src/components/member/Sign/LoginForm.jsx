import React, { useState } from "react";
import KakaoLoginBtn from "./KakaoLoginBtn";
import GoogleLoginBtn from "./GoogleLoginBtn";
import "@/css/member/sign/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Attempt:", { email, password });
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
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
      </form>

      <div className="social-login">
        <p>또는</p>
        <KakaoLoginBtn />
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default LoginForm;
