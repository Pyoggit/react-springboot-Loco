import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/FindEmailForm.css";

const FindEmailResult = () => {
  //   const [email, setEmail] = useState("");
  //   const [name, mobile] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Find Email Attempt:", { name, mobile });
  };

  const onFindEmailClick = () => {
    navigate("/find/email/result"); // 일부 가린 이메일을 보여주는 페이지로 이동동
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>이메일 찾기</h2>
        <form onSubmit={handleSubmit} className="find-email-form">
          <div className="input-group">
            <label htmlFor="password">이름</label>
            <input
              type="password"
              id="password"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">휴대폰 번호</label>
            <input
              type="email"
              id="email"
              placeholder="휴대폰 번호를 입력하세요"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="find-email-btn">
            이메일 찾기
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindEmailResult;
