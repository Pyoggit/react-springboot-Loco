import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/FindPwForm.css";

const FindPwForm = () => {
  //   const [email, setEmail] = useState("");
  //   const [name, mobile] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Find Email Attempt:", { email });
  };

  const onFindEmailClick = () => {
    navigate("/send/email/result"); // 일부 가린 이메일을 보여주는 페이지로 이동동
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit} className="find-email-form">
          <div className="input-group">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="find-pw-btn">
            비밀번호 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPwForm;
