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
  const [error, setError] = useState(""); // 로그인 실패 메시지 상태 추가
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // 기존 오류 메시지 초기화

    try {
      const response = await axios.post(
        "http://localhost:8080/api/adminpage/login",
        {
          email,
          password,
        }
      );

      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      // console.data("관리자 로그인성공토큰" + response.data);

      // JWT 액세스 토큰 저장
      // localStorage.setItem("adminAccessToken", response.data.accessToken);

      // // Authorization 헤더를 사용하여 인증 요청 테스트
      // const testResponse = await axios.get(
      //   "http://localhost:8080/api/adminpage/test",
      //   {
      //     headers: { Authorization: `Bearer ${response.data.accessToken}` },
      //   }
      // );

      // console.log("관리자 인증 테스트 성공:", testResponse.data);

      // 관리자페이지로 이동
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

  // return (
  //   <div id="auth-wrapper">
  //     <div className="auth-container">
  //       <h2>관리자 로그인</h2>

  //       <form onSubmit={handleSubmit} className="login-form">
  //         <div className="normal-login-form">
  //           <div className="input-group">
  //             <label htmlFor="email">이메일</label>
  //             <input
  //               type="email"
  //               id="email"
  //               placeholder="이메일을 입력하세요"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //               required
  //             />
  //           </div>
  //           <div className="input-group">
  //             <label htmlFor="password">비밀번호</label>
  //             <input
  //               type="password"
  //               id="password"
  //               placeholder="비밀번호를 입력하세요"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //               required
  //             />
  //           </div>
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
          {error && <p className="admin-error-message">{error}</p>}{" "}
          {/* 로그인 실패 시 메시지 출력 */}
          <button type="submit" className="login-btn">
            관리자 로그인
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLoginMain;
