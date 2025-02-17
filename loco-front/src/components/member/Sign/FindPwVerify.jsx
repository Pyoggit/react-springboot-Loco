import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/FindPwForm.css";

const FindPwVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/users/verify-code", {
        email,
        code,
      });

      if (response.status === 200) {
        navigate(`/find-password/result?email=${email}`);
      }
    } catch (err) {
      setError(err.response?.data || "인증번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>인증번호 입력</h2>
        <form onSubmit={handleVerify} className="login-form">
          <div className="input-group">
            <label>이메일</label>
            <input type="email" value={email} disabled />
          </div>
          <div className="input-group">
            <label>인증번호</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="find-pw-btn" disabled={loading}>
            {loading ? "확인 중..." : "인증하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPwVerify;
