import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faKey,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import "@/css/admin/AdminLoginMain.css";

const AdminLoginMain = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 로그인 인증 기능 구현
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // 임시 관리자 계정
    if (email === "admin" && password === "admin") {
      navigate("/adminpage");
    } else {
      setMessage("아이디 또는 비밀번호가 올바르지 않습니다.");
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
          {message && <p className="admin-error-message">{message}</p>}
          <button type="submit" className="admin-login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginMain;
