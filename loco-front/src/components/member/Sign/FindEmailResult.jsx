import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/FindEmailForm.css";

const FindEmailResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name") || "";
  const mobile = queryParams.get("mobile") || "";

  const [email, setEmail] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (name && mobile) {
      findEmail();
    }
  }, [name, mobile]);

  const findEmail = async () => {
    try {
      const response = await axios.post("/api/users/find-email", {
        name,
        mobile,
      });

      if (response.data.email) {
        setEmail(response.data.email); // ✅ 객체가 아닌 email 문자열만 저장
      } else {
        setError("일치하는 계정이 없습니다.");
      }
    } catch (err) {
      console.error("이메일 찾기 오류:", err);
      setError("이메일을 찾을 수 없습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>이메일 찾기 결과</h2>
        {email ? (
          <>
            <p className="email-result">
              회원님의 이메일: <strong>{email}</strong>
            </p>
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인하러 가기
            </button>
          </>
        ) : (
          <p className="error-message">{error}</p>
        )}
      </div>
    </div>
  );
};

export default FindEmailResult;
