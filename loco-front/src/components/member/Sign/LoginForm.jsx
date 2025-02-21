import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLoginBtn from "./KakaoLoginBtn";
import GoogleLoginBtn from "./GoogleLoginBtn";
import axios from "@/utils/AxiosConfig";
import { useCookies } from "react-cookie";
import "@/css/member/sign/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([
    "normal_accessToken",
    "normal_refreshToken",
  ]);

  useEffect(() => {
    console.log("✅ 현재 저장된 쿠키 (document.cookie):", document.cookie);
    console.log("✅ 현재 저장된 쿠키 (useCookies):", cookies);
  }, [cookies]);

  const fetchUserEmail = async (userId, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.email) {
        localStorage.setItem("userEmail", response.data.email);
        console.log("✅ 저장된 이메일:", localStorage.getItem("userEmail"));
      } else {
        console.error("❌ 이메일을 가져오지 못함:", response.data);
      }
    } catch (error) {
      console.error("❌ 이메일 가져오기 실패:", error);
    }
  };
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
      console.log("✅ 로그인한 유저 이메일:", storedEmail);
    } else {
      console.log("❌ 저장된 이메일 없음");
    }
  }, []);
  /** 로그인 처리 함수 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post("/api/users/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("✅ 로그인 요청 후 응답:", response);

      if (response.data.normal_accessToken) {
        const accessToken = response.data.normal_accessToken;
        localStorage.setItem("normal_accessToken", accessToken);
        localStorage.setItem(
          "normal_accessToken",
          response.data.normal_accessToken
        );
        localStorage.setItem(
          "normal_refreshToken",
          response.data.normal_refreshToken
        );

        console.log(
          "✅ 저장된 토큰:",
          localStorage.getItem("normal_accessToken"),
          localStorage.getItem("normal_refreshToken")
        );

        // ✅ 로그인 후 `userId` 가져오기
        const userInfoResponse = await axios.get("/api/users/mypage", {
          headers: {
            Authorization: `Bearer ${response.data.normal_accessToken}`,
          },
        });
        const userData = userInfoResponse.data;
        console.log("📌 로그인 후 가져온 사용자 정보:", userInfoResponse.data);
        console.log(
          "📌 유저 프로필 sysFile:",
          userInfoResponse.data.profileImage
        );

        if (userInfoResponse.data.userId) {
          localStorage.setItem("userId", userInfoResponse.data.userId);
          localStorage.setItem("userName", userInfoResponse.data.userName);

          fetchUserEmail(userData.userId, accessToken);
        }

        if (userInfoResponse.data.profileImage) {
          localStorage.setItem(
            "profileImage",
            userInfoResponse.data.profileImage
          );
        }

        alert("로그인 성공!");
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error(
          "❌ 로그인 응답에 normal_accessToken 없음!",
          response.data
        );
      }
    } catch (error) {
      console.error("❌ 로그인 실패:", error.response?.data || error.message);
      setError("아이디 혹은 패스워드가 틀렸습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  /** ✅ 로그인 처리 함수 =============================================================================== */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setIsLoading(true);

  //   try {
  //     let response;

  //     // ✅ 관리자 로그인 시도
  //     response = await axios.post("/api/adminpage/login", {
  //       email: email.trim(),
  //       password: password.trim(),
  //     });

  //     if (response.data.accessToken) {
  //       const accessToken = response.data.accessToken;
  //       localStorage.setItem("admin_accessToken", accessToken);
  //       alert("✅ 관리자 로그인 성공!");
  //       navigate("/adminpage");
  //       return;
  //     }

  //     // ✅ 일반 사용자 로그인 시도
  //     response = await axios.post("/api/users/login", {
  //       email: email.trim(),
  //       password: password.trim(),
  //     });

  //     if (response.data.normal_accessToken) {
  //       const accessToken = response.data.normal_accessToken;
  //       localStorage.setItem("normal_accessToken", accessToken);
  //       localStorage.setItem(
  //         "normal_refreshToken",
  //         response.data.normal_refreshToken
  //       );

  //       // ✅ 로그인한 유저 정보 가져오기
  //       const userInfoResponse = await axios.get("/api/users/mypage", {
  //         headers: { Authorization: `Bearer ${accessToken}` },
  //       });

  //       const userData = userInfoResponse.data;
  //       localStorage.setItem("userId", userData.userId);
  //       localStorage.setItem("userName", userData.userName);

  //       alert("✅ 로그인 성공!");
  //       navigate("/");
  //       setTimeout(() => window.location.reload(), 100);
  //     } else {
  //       throw new Error("토큰이 응답에서 누락되었습니다.");
  //     }
  //   } catch (error) {
  //     console.error("❌ 로그인 실패:", error.response?.data || error.message);
  //     setError("이메일 또는 비밀번호를 확인하세요.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div id="auth-wrapper">
      <a href="#" onClick={() => navigate("/")}>
        {/* <div className="logo-main-icon-loginForm"></div> */}
        <div className="header-logo-loginForm">{"AroundMe"}</div>
      </a>
      <div className="auth-container">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="normal-login-form">
            <div className="input-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailInputRef}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <br />
            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="social-login-btn">
          <p>또는</p>
          <KakaoLoginBtn />
          {/* <GoogleLoginBtn /> */}
        </div>

        <div className="bottom-sec">
          <div className="find-email-pw">
            <div className="find-email" onClick={() => navigate("/find/email")}>
              이메일 찾기
            </div>
            <div className="find-pw" onClick={() => navigate("/find-password")}>
              비밀번호 찾기
            </div>
          </div>

          <div className="signup-link" onClick={() => navigate("/signup")}>
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
