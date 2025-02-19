import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faKey,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "@/css/admin/AdminLoginMain.css";

const AdminLoginMain = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ 수정: axios 인스턴스를 사용하여 요청
      const response = await axios.post("/api/adminpage/login", {
        email,
        password,
      });

      const accessToken = response.data.accessToken;

      if (!accessToken) {
        throw new Error("토큰이 응답에서 누락되었습니다.");
      }

      // ✅ 관리자 토큰 저장
      localStorage.setItem("admin_token", accessToken);

      alert("✅ 관리자 로그인 성공!");
      navigate("/adminpage");
    } catch (error) {
      console.error(
        "🚨 관리자 로그인 실패:",
        error.response?.data || error.message
      );
      setError("❌ 로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-container">
        <h2 className="admin-login-title">관리자 로그인</h2>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{ marginRight: "10px" }}
            />
            <input
              type="text"
              placeholder="아이디"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <FontAwesomeIcon icon={faKey} style={{ marginRight: "10px" }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="admin-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          {error && <p className="admin-error-message">{error}</p>}
          <button type="submit" className="login-btn">
            관리자 로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginMain;
