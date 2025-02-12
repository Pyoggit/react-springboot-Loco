// import { useState } from "react";
// import DaumPostcode from "react-daum-postcode"; // 우편번호 검색 라이브러리
// import "@/css/member/mypage/ModifyMember.css"; // 기존 CSS 유지

// const ModifyMember = () => {
//   const dummyUser = {
//     email: "test@example.com",
//     password: "password123",
//     confirmPassword: "password123",
//     name: "홍길동",
//     gender: "M",
//     mobile1: "010",
//     mobile2: "1234",
//     mobile3: "5678",
//     phone1: "02",
//     phone2: "123",
//     phone3: "4567",
//     birthDate: "1995-06-15",
//     zonecode: "12345",
//     address: "서울특별시 강남구 테헤란로 123",
//     detailAddress: "아파트 101호",
//     profileImage: null,
//   };

//   const [formData, setFormData] = useState(dummyUser);
//   const [isOpen, setIsOpen] = useState(false);

//   const handleComplete = (data) => {
//     let fullAddress = data.address;
//     let extraAddress = "";

//     if (data.addressType === "R") {
//       if (data.bname !== "") {
//         extraAddress += data.bname;
//       }
//       if (data.buildingName !== "") {
//         extraAddress +=
//           extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
//       }
//     }

//     setFormData({
//       ...formData,
//       address: `${fullAddress} ${extraAddress}`,
//       zonecode: data.zonecode,
//     });

//     setIsOpen(false);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleFileChange = (e) => {
//     setFormData({ ...formData, profileImage: e.target.files[0] });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       alert("비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     console.log("수정된 데이터:", formData);
//   };

//   return (
//     // <div>
//     <div className="modify-container">
//       <h2>회원정보 수정</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="modify-group">
//           <label className="modify-title">이메일</label>
//           <input
//             className="modify-input"
//             type="email"
//             name="email"
//             value={formData.email}
//             readOnly
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">비밀번호</label>
//           <input
//             className="modify-input"
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">비밀번호 확인</label>
//           <input
//             className="modify-input"
//             type="password"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">이름</label>
//           <input
//             className="modify-input"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">성별</label>
//           <select
//             className="input-gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             required
//           >
//             <option value="M">남성</option>
//             <option value="F">여성</option>
//           </select>
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">휴대폰번호</label>
//           <div className="input-phone">
//             <input
//               className="input-phone1"
//               type="text"
//               name="mobile1"
//               value={formData.mobile1}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="input-phone2"
//               type="text"
//               name="mobile2"
//               value={formData.mobile2}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="input-phone3"
//               type="text"
//               name="mobile3"
//               value={formData.mobile3}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">전화번호</label>
//           <div className="input-phone">
//             <input
//               className="input-phone1"
//               type="text"
//               name="phone1"
//               value={formData.phone1}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="input-phone2"
//               type="text"
//               name="phone2"
//               value={formData.phone2}
//               onChange={handleChange}
//               required
//             />
//             <input
//               className="input-phone3"
//               type="text"
//               name="phone3"
//               value={formData.phone3}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">생년월일</label>
//           <input
//             className="modify-input"
//             type="date"
//             name="birthDate"
//             value={formData.birthDate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">우편번호</label>
//           <div className="input-zipcode">
//             <input
//               className="input-zipcodeMain"
//               type="text"
//               name="zonecode"
//               value={formData.zonecode}
//               onChange={handleChange}
//               required
//             />
//             <button
//               className="btn-zipcode"
//               type="button"
//               onClick={() => setIsOpen(true)}
//             >
//               찾기
//             </button>
//           </div>
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">기본주소</label>
//           <input
//             className="modify-input"
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">상세주소</label>
//           <input
//             className="modify-input"
//             type="text"
//             name="detailAddress"
//             value={formData.detailAddress}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="modify-group">
//           <label className="modify-title">프로필 사진</label>
//           <input
//             className="modify-input"
//             type="file"
//             name="profileImage"
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//         </div>

//         <button type="submit" className="modify-btn">
//           수정하기
//         </button>
//       </form>

//       {isOpen && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <button className="close-btn" onClick={() => setIsOpen(false)}>
//               닫기
//             </button>
//             <DaumPostcode onComplete={handleComplete} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModifyMember;

import { useState, useEffect, useRef } from "react";
import DaumPostcode from "react-daum-postcode"; // 우편번호 검색 라이브러리
import axios from "@/utils/AxiosConfig"; // Axios 기본 설정 (withCredentials 등 포함)
import "@/css/member/mypage/ModifyMember.css";

const ModifyMember = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    gender: "",
    mobile1: "",
    mobile2: "",
    mobile3: "",
    phone1: "",
    phone2: "",
    phone3: "",
    birthDate: "",
    zipcode: "",
    address: "",
    detailAddress: "",
    profileImage: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  // 컴포넌트가 마운트될 때 로그인 토큰을 이용해 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      // 토큰은 로그인 시 저장된 "normal_accessToken" 키로부터 가져옴
      const token = localStorage.getItem("normal_accessToken");
      if (!token) {
        console.error("로그인 토큰이 없습니다.");
        return;
      }
      try {
        // API 요청: 백엔드에서 현재 로그인한 사용자 정보를 가져옵니다.
        const response = await axios.get("/api/users/mypage", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("📌 받은 유저 정보:", response.data);
        const user = response.data;
        // API 응답 필드에 맞게 formData를 업데이트합니다.
        setFormData({
          email: user.email || user.userEmail || "",
          // 비밀번호는 API로부터 조회되지 않으므로, 수정 시 사용자가 입력하게 합니다.
          password: "",
          confirmPassword: "",
          name: user.userName || "",
          // gender: user.gender || "",
          gender:
            user.gender === "남성" ? "M" : user.gender === "여성" ? "F" : "",
          mobile1: user.mobile1 || "",
          mobile2: user.mobile2 || "",
          mobile3: user.mobile3 || "",
          phone1: user.phone1 || "",
          phone2: user.phone2 || "",
          phone3: user.phone3 || "",
          birthDate: user.birthDate ? user.birthDate.substring(0, 10) : "",
          zipcode: user.zipcode || "",
          address: user.address || "",
          detailAddress: user.detailAddress || "",
          profileImage: user.profileImage || "",
        });
      } catch (error) {
        console.error("유저 정보 가져오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // 우편번호 검색 완료 후 처리
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
    setFormData((prev) => ({
      ...prev,
      address: `${fullAddress} ${extraAddress}`,
      zipcode: data.zipcode,
    }));
    setIsOpen(false);
  };

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 입력 처리
  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
  };

  // 폼 제출 처리 (수정된 데이터 콘솔 출력; 실제 API 호출로 수정 가능)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log("수정된 데이터:", formData);
    // API 호출 예: axios.put("/api/mypage/update", formData) 등
  };

  return (
    <div className="modify-container">
      <h2>회원정보 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="modify-group">
          <label className="modify-title">이메일</label>
          <input
            className="modify-input"
            type="email"
            name="email"
            value={formData.email}
            readOnly
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">비밀번호</label>
          <input
            className="modify-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">비밀번호 확인</label>
          <input
            className="modify-input"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">이름</label>
          <input
            className="modify-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">성별</label>
          <select
            className="input-gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="M">남성</option>
            <option value="F">여성</option>
          </select>
        </div>
        <div className="modify-group">
          <label className="modify-title">휴대폰번호</label>
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
        <div className="modify-group">
          <label className="modify-title">전화번호</label>
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
        <div className="modify-group">
          <label className="modify-title">생년월일</label>
          <input
            className="modify-input"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">우편번호</label>
          <div className="input-zipcode">
            <input
              className="input-zipcodeMain"
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              required
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
        <div className="modify-group">
          <label className="modify-title">기본주소</label>
          <input
            className="modify-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">상세주소</label>
          <input
            className="modify-input"
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">프로필 사진</label>
          <input
            className="modify-input"
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="modify-btn">
          수정하기
        </button>
      </form>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              닫기
            </button>
            <DaumPostcode onComplete={handleComplete} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifyMember;
