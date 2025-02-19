import React, { useState, useEffect } from "react";
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
  const [timeLeft, setTimeLeft] = useState(60); // ✅ 60초 타이머 초기화
  const [expired, setExpired] = useState(false); // ✅ 시간 초과 상태

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setExpired(true); // ✅ 시간이 0이 되면 입력 불가능하게 변경
    }
  }, [timeLeft]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (expired) {
      setError("⏳ 입력 시간이 초과되었습니다.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/users/verify-code", {
        email,
        code,
      });

      if (response.status === 200) {
        navigate(`/find-password/result?email=${email}`);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "❌ 유효한 인증번호가 아닙니다." // ✅ 오류 메시지 안전 처리
      );
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
              disabled={expired} // ✅ 시간이 초과되면 입력 불가능
            />
          </div>

          {/* ✅ 타이머 표시 */}
          <p className={`timer-message ${expired ? "error-text" : ""}`}>
            {expired
              ? "⏳ 입력 시간이 초과되었습니다."
              : `⏳ 남은 시간: ${timeLeft}초`}
          </p>

          {/* ✅ 오류 메시지 표시 */}
          {error && <p className="error-message">{String(error)}</p>}

          <button
            type="submit"
            className="find-pw-btn"
            disabled={loading || expired}
          >
            {loading ? "확인 중..." : "인증하기"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FindPwVerify;
