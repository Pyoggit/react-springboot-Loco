import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import "@/css/member/sign/SignUpForm.css";

const SignUpForm = () => {
  const navigate = useNavigate();

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
  const zonecode = useRef();
  const address = useRef();
  const detailAddress = useRef();
  const profileImage = useRef();

  const [isOpen, setIsOpen] = useState(false);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
    }

    zonecode.current.value = data.zonecode;
    address.current.value = `${fullAddress} ${extraAddress}`;
    setIsOpen(false);
  };

  // axios 버전
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
      gender: gender.current.value,
      mobile1: mobile1.current.value,
      mobile2: mobile2.current.value,
      mobile3: mobile3.current.value,

      phone1: phone1.current.value || null, // 입력 안 하면 null
      phone2: phone2.current.value || null, // 입력 안 하면 null
      phone3: phone3.current.value || null, // 입력 안 하면 null
      address2: detailAddress.current.value || null, // 입력 안 하면 null

      birth: birthDate.current.value,
      zipcode: zonecode.current.value,
      address1: address.current.value,
      roleId: 2,
    };

    console.log("회원가입 데이터:", user);

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    ); //JSON을 Blob으로 변환
    if (profileImage.current.files[0]) {
      formData.append("profileImage", profileImage.current.files[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/users/signup",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // CORS
        }
      );

      console.log("회원가입 성공! response:", response); // 서버 응답 확인

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        navigate("/login"); // 로그인 페이지 이동
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label className="title">이메일</label>
          <input className="input" type="email" ref={email} required />
        </div>

        <div className="group">
          <label className="title">비밀번호</label>
          <input className="input" type="password" ref={password} required />
        </div>

        <div className="group">
          <label className="title">비밀번호 확인</label>
          <input
            className="input"
            type="password"
            ref={confirmPassword}
            required
          />
        </div>

        <div className="group">
          <label className="title">이름</label>
          <input className="input" type="text" ref={name} required />
        </div>

        <div className="group">
          <label className="title">성별</label>
          <select className="input-gender" ref={gender} required>
            <option value="">선택하세요</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>

        <div className="group">
          <label className="title">휴대폰번호</label>
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

        <div className="group">
          <label className="title">전화번호</label>
          <div className="input-phone">
            <input
              className="input-phone1"
              type="text"
              ref={phone1}
              defaultValue="02"
            />
            <input className="input-phone2" type="text" ref={phone2} />
            <input className="input-phone3" type="text" ref={phone3} />
          </div>
        </div>

        <div className="group">
          <label className="title">생년월일</label>
          <input className="input" type="date" ref={birthDate} />
        </div>

        <div className="group">
          <label className="title">우편번호</label>
          <div className="input-zipcode">
            <input
              className="input-zipcodeMain"
              type="text"
              ref={zonecode}
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

        <div className="group">
          <label className="title">기본주소</label>
          <input className="input" type="text" ref={address} readOnly />
        </div>

        <div className="group">
          <label className="title">상세주소</label>
          <input className="input" type="text" ref={detailAddress} />
        </div>

        <div className="group">
          <label className="title">프로필 사진</label>
          <input
            className="input"
            type="file"
            ref={profileImage}
            accept="image/*"
          />
        </div>

        <button type="submit" className="signup-btn">
          가입하기
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
  );
};

export default SignUpForm;
