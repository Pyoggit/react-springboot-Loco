import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      // 관리자 로그인 엔드포인트 호출 (/api/adminpage/login)
      const response = await axios.post(
        "http://localhost:8080/api/adminpage/login",
        { email, password }
      );
      const accessToken = response.data.accessToken;

      // 관리자 전용 토큰 키로 저장
      localStorage.setItem("admin_accessToken", accessToken);

      alert("관리자 로그인 성공!");
      navigate("/adminpage");
    } catch (error) {
      console.error(
        "관리자 로그인 실패:",
        error.response?.data || error.message
      );
      setError("로그인 실패: 이메일 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-container">
        <img
          src="/src/assets/images/headerLogo.png"
          alt="관리자 로고"
          className="admin-logo"
          onClick={() => navigate("/")}
        />
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
