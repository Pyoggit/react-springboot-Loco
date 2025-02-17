import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/FindPwForm.css";

const FindPwResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email") || "";

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (email) {
      axios
        .post("/api/users/reset-password", { email })
        .then((response) => {
          setMessage(
            "임시 비밀번호가 이메일로 전송되었습니다. 로그인 후 변경해 주세요."
          );
        })
        .catch((error) => {
          setError("임시 비밀번호 발급에 실패했습니다.");
        });
    }
  }, [email]);

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>비밀번호 찾기 완료</h2>
        {message ? (
          <p className="success-message">{message}</p>
        ) : (
          <p className="error-message">{error}</p>
        )}
        <button className="find-pw-btn" onClick={() => navigate("/login")}>
          로그인하러 가기
        </button>
      </div>
    </div>
  );
};

export default FindPwResult;
