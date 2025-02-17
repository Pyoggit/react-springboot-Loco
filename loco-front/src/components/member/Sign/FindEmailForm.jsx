import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/sign/FindEmailForm.css";

const FindEmailForm = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/find/email/result?name=${name}&mobile=${mobile}`);
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>이메일 찾기</h2>
        <form onSubmit={handleSubmit} className="find-email-form">
          <div className="input-group">
            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>휴대폰 번호</label>
            <input
              type="text"
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

export default FindEmailForm;
