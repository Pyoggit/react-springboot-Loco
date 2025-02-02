import { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import "@/css/member/sign/SignUpForm.css";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    mobile1: "010",
    mobile2: "",
    mobile3: "",
    phone1: "02",
    phone2: "",
    phone3: "",
    birthDate: "",
    zonecode: "",
    address: "",
    detailAddress: "",
    profileImage: null,
  });

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

    setFormData({
      ...formData,
      address: `${fullAddress} ${extraAddress}`,
      zonecode: data.zonecode,
    });

    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("서버로 보낼 데이터:", formData);
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label className="title">이메일</label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">비밀번호</label>
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">비밀번호 확인</label>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">이름</label>
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">성별</label>
          <select
            className="input-gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>

        <div className="group">
          <label className="title">휴대폰번호</label>
          <div className="input-phone">
            <input
              className="input-phone1"
              type="text"
              name="mobile1"
              value={formData.mobile1}
              onChange={handleChange}
              required
            />
            <input
              className="input-phone2"
              type="text"
              name="mobile2"
              value={formData.mobile2}
              onChange={handleChange}
              required
            />
            <input
              className="input-phone3"
              type="text"
              name="mobile3"
              value={formData.mobile3}
              onChange={handleChange}
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
              name="phone1"
              value={formData.phone1}
              onChange={handleChange}
              required
            />
            <input
              className="input-phone2"
              type="text"
              name="phone2"
              value={formData.phone2}
              onChange={handleChange}
              required
            />
            <input
              className="input-phone3"
              type="text"
              name="phone3"
              value={formData.phone3}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="group">
          <label className="title">생년월일</label>
          <input
            className="input"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">우편번호</label>
          <div className="input-zipcode">
            <input
              className="input-zipcodeMain"
              type="text"
              name="zonecode"
              value={formData.zonecode}
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
          <input
            className="input"
            type="text"
            name="address"
            value={formData.address}
            readOnly
          />
        </div>

        <div className="group">
          <label className="title">상세주소</label>
          <input
            className="input"
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            required
          />
        </div>

        <div className="group">
          <label className="title">프로필 사진</label>
          <input
            className="input"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
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
