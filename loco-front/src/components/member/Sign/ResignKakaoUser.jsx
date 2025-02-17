import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import axios from "@/utils/AxiosConfig";
import "@/css/member/sign/ResignKakaoUser.css";

const ResignKakaoUser = () => {
  const navigate = useNavigate();

  // ✅ 입력 필드 refs
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const name = useRef();
  const gender = useRef();
  const mobile1 = useRef();
  const mobile2 = useRef();
  const mobile3 = useRef();
  const phone1 = useRef();
  const phone2 = useRef();
  const phone3 = useRef();
  const birthDate = useRef();
  const zipcode = useRef();
  const address1 = useRef();
  const address2 = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    const fetchKakaoUser = async () => {
      try {
        // ✅ `localStorage`에서 `kakao_accessToken` 가져오기
        const kakaoAccessToken = localStorage.getItem("kakao_accessToken");

        if (!kakaoAccessToken) {
          console.error("🚨 카카오 액세스 토큰 없음! 로그인 필요");
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        // ✅ 백엔드에 요청 보내서 카카오 사용자 정보 가져오기
        const response = await axios.get("/api/auth/kakao/temp-user", {
          headers: {
            Authorization: `Bearer ${kakaoAccessToken}`, // ✅ `Authorization` 헤더에 토큰 추가
          },
        });

        console.log("📌 카카오 유저 정보:", response.data);
        const user = response.data;

        // ✅ 입력 필드에 데이터 설정
        if (email.current) email.current.value = user.email || "";
        if (name.current) name.current.value = user.userName || "";
        if (gender.current) gender.current.value = user.gender || "";
        if (birthDate.current) birthDate.current.value = user.birthDate || "";
        setProfileImageUrl(user.profileImage || ""); // ✅ 프로필 이미지 설정
      } catch (error) {
        console.error("🚨 카카오 유저 정보 불러오기 실패:", error);
      }
    };

    fetchKakaoUser();
  }, [navigate]);

  // ✅ 우편번호 검색 완료 후 처리
  const handleComplete = (data) => {
    let fullAddress = data.address;
    zipcode.current.value = data.zonecode;
    address1.current.value = fullAddress;
    setIsOpen(false);
  };

  // ✅ 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.current.value !== confirmPassword.current.value) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const user = {
      userEmail: email.current.value,
      password: password.current.value,
      userName: name.current.value,
      gender: gender.current.value || null,
      mobile1: mobile1.current.value,
      mobile2: mobile2.current.value,
      mobile3: mobile3.current.value,
      phone1: phone1.current.value || null,
      phone2: phone2.current.value || null,
      phone3: phone3.current.value || null,
      birth: birthDate.current.value || null,
      zipcode: zipcode.current.value,
      address1: address1.current.value,
      address2: address2.current.value || null,
    };

    console.log("✅ 카카오 추가 정보 등록 데이터:", user);

    try {
      await axios.post("/api/auth/kakao/complete-register", user, {
        headers: { "Content-Type": "application/json" },
      });

      alert("🎉 회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      console.error("🚨 회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="auth-container">
        <h2>카카오 추가 정보 입력</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-group">
            <label className="signup-title">이메일</label>
            <input className="signup-input" type="email" ref={email} readOnly />
          </div>

          <div className="signup-group">
            <label className="signup-title">비밀번호</label>
            <input
              className="signup-input"
              type="password"
              ref={password}
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-title">비밀번호 확인</label>
            <input
              className="signup-input"
              type="password"
              ref={confirmPassword}
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-title">이름</label>
            <input className="signup-input" type="text" ref={name} readOnly />
          </div>

          <div className="signup-group">
            <label className="signup-title">성별</label>
            <select className="input-gender" ref={gender} required>
              <option value="">선택하세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </div>

          <div className="signup-group">
            <label className="signup-title">휴대폰번호</label>
            <div className="input-phone">
              <input
                className="input-phone1"
                type="text"
                ref={mobile1}
                defaultValue="010"
                required
              />
              <input
                className="input-phone2"
                type="text"
                ref={mobile2}
                required
              />
              <input
                className="input-phone3"
                type="text"
                ref={mobile3}
                required
              />
            </div>
          </div>

          <div className="signup-group">
            <label className="signup-title">전화번호</label>
            <div className="input-phone">
              <input className="input-phone1" type="text" ref={phone1} />
              <input className="input-phone2" type="text" ref={phone2} />
              <input className="input-phone3" type="text" ref={phone3} />
            </div>
          </div>

          <div className="signup-group">
            <label className="signup-title">생년월일</label>
            <input
              className="signup-input"
              type="date"
              ref={birthDate}
              required
            />
          </div>

          <div className="signup-group">
            <label className="signup-title">우편번호</label>
            <div className="input-zipcode">
              <input
                className="input-zipcodeMain"
                type="text"
                ref={zipcode}
                readOnly
              />
              <button
                className="btn-zipcode"
                type="button"
                onClick={() => setIsOpen(true)}
              >
                찾기
              </button>
            </div>
          </div>

          <div className="signup-group">
            <label className="signup-title">기본주소</label>
            <input
              className="signup-input"
              type="text"
              ref={address1}
              readOnly
            />
          </div>

          <div className="signup-group">
            <label className="signup-title">상세주소</label>
            <input className="signup-input" type="text" ref={address2} />
          </div>

          {/* <div className="signup-group">
            <label className="signup-title">프로필 사진</label>
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="카카오 프로필"
                className="profile-preview"
              />
            )}
          </div> */}

          <button type="submit" className="signup-btn">
            가입 완료
          </button>
        </form>

        {isOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setIsOpen(false)}>닫기</button>
              <DaumPostcode onComplete={handleComplete} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResignKakaoUser;
