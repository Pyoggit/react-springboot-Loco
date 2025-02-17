import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/FindPwForm.css";

const FindPwForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/users/request-verification", {
        name,
        email,
      });

      if (response.status === 200) {
        navigate(`/find-password/verify?email=${email}`);
      }
    } catch (err) {
      setError(err.response?.data || "인증번호 요청 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>비밀번호 찾기</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="find-pw-btn" disabled={loading}>
            {loading ? "요청 중..." : "인증번호 받기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPwForm;
