import { useRef, useState, useEffect } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "@/utils/AxiosConfig";
import "@/css/member/mypage/ModifyMember.css";

const ModifyMember = () => {
  const [formData, setFormData] = useState({
    email: "", // ✅ userEmail -> email
    password: "",
    confirmPassword: "",
    userName: "",
    gender: "",
    mobile1: "",
    mobile2: "",
    mobile3: "",
    phone1: "",
    phone2: "",
    phone3: "",
    birth: "",
    zipcode: "",
    address: "", // ✅ address1 -> address
    detailAddress: "", // ✅ address2 -> detailAddress
    profileImage: null,
  });

  const [isOpen, setIsOpen] = useState(false);

  // ✅ 카카오 / 일반 로그인 토큰 가져오기
  const getAuthToken = () => {
    return (
      localStorage.getItem("normal_accessToken") ||
      localStorage.getItem("kakao_accessToken")
    );
  };

  // ✅ 주소 검색 완료 핸들러
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

    const completeAddress = `${fullAddress} ${extraAddress}`;

    setFormData((prev) => ({
      ...prev,
      zipcode: data.zonecode,
      address: completeAddress, // ✅ address -> address1으로 변경
    }));

    setIsOpen(false);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.warn("🚨 로그인 토큰 없음 → API 요청 안 보냄");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get("/api/users/mypage", { headers });

        console.log("📌 받은 유저 정보:", response.data);
        const user = response.data;

        // ✅ userEmail이 아니라 email로 변경!
        if (!user || !user.email) {
          console.error("❌ 유저 정보가 올바르게 오지 않음:", user);
          return;
        }

        setFormData({
          email: user.email || "", // ✅ userEmail -> email
          password: "",
          confirmPassword: "",
          userName: user.userName || "",
          gender: user.gender || "",
          mobile1: user.mobile1 || "",
          mobile2: user.mobile2 || "",
          mobile3: user.mobile3 || "",
          phone1: user.phone1 || "",
          phone2: user.phone2 || "",
          phone3: user.phone3 || "",
          birth: user.birth ? user.birth.substring(0, 10) : "",
          zipcode: user.zipcode || "",
          address: user.address || "", // ✅ address1 -> address
          detailAddress: user.detailAddress || "", // ✅ address2 -> detailAddress
          profileImage: null,
        });
      } catch (error) {
        console.error("❌ 유저 정보 가져오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // ✅ 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`🔄 변경된 값 → ${name}:`, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 파일 입력 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  // ✅ 회원정보 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      password,
      confirmPassword,
      userName,
      mobile2,
      mobile3,
      phone2,
      phone3,
    } = formData;

    // ✅ 비밀번호 검증 (영어, 숫자, 특수문자 중 2가지 이상 포함 + 7~20자리)
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)|(?=.*[A-Za-z])(?=.*[\W_])|(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{7,20}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "비밀번호는 영어, 숫자, 특수문자 중 2가지 이상 포함한 7~20자리여야 합니다."
      );
      return;
    }

    // ✅ 이름 검증 (2자 이상 8자 이하)
    if (userName.length < 2 || userName.length > 8) {
      alert("이름은 2자 이상 8자 이하로 입력해야 합니다.");
      return;
    }

    // ✅ 전화번호 검증 (각 칸은 4자 이상 입력 불가능)
    if (mobile2.length > 4 || mobile3.length > 4) {
      alert("휴대폰 번호는 각 칸마다 최대 4자리까지만 입력 가능합니다.");
      return;
    }
    if (phone2.length > 4 || phone3.length > 4) {
      alert("전화번호는 각 칸마다 최대 4자리까지만 입력 가능합니다.");
      return;
    }

    // ✅ 비밀번호 확인
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        return;
      }

      const userData = new FormData();

      const userJson = JSON.stringify({
        userEmail: formData.email,
        password: formData.password,
        userName: formData.userName,
        gender: formData.gender,
        mobile1: formData.mobile1,
        mobile2: formData.mobile2,
        mobile3: formData.mobile3,
        phone1: formData.phone1,
        phone2: formData.phone2,
        phone3: formData.phone3,
        birth: formData.birth,
        zipcode: formData.zipcode,
        address1: formData.address,
        address2: formData.detailAddress,
      });

      userData.append(
        "user",
        new Blob([userJson], { type: "application/json" })
      );

      if (formData.profileImage instanceof File) {
        userData.append("profileImage", formData.profileImage);
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const response = await axios.put("/api/users/update", userData, {
        headers,
      });

      console.log("✅ 회원정보 수정 성공:", response.data);
      alert("회원정보가 성공적으로 수정되었습니다!");
    } catch (error) {
      console.error("❌ 회원정보 수정 실패:", error);

      if (error.response) {
        console.error("🔴 서버 응답:", error.response.data);
        alert(
          `회원정보 수정 실패: ${error.response.data.error || "서버 오류"}`
        );
      } else {
        alert("회원정보 수정에 실패했습니다.");
      }
    }
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
            name="userName"
            value={formData.userName}
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
            <option value="남성">남성</option>
            <option value="여성">여성</option>
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
              maxLength={3}
            />
            <input
              className="input-phone2"
              type="text"
              name="mobile2"
              value={formData.mobile2}
              onChange={handleChange}
              required
              maxLength={4}
            />
            <input
              className="input-phone3"
              type="text"
              name="mobile3"
              value={formData.mobile3}
              onChange={handleChange}
              required
              maxLength={4}
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
              // required
              maxLength={3}
            />
            <input
              className="input-phone2"
              type="text"
              name="phone2"
              value={formData.phone2}
              onChange={handleChange}
              // required
              maxLength={4}
            />
            <input
              className="input-phone3"
              type="text"
              name="phone3"
              value={formData.phone3}
              onChange={handleChange}
              // required
              maxLength={4}
            />
          </div>
        </div>
        <div className="modify-group">
          <label className="modify-title">생년월일</label>
          <input
            className="modify-input"
            type="date"
            name="birth"
            value={formData.birth}
            onChange={handleChange}
            required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">우편번호</label>
          <div className="input-zipcode">
            {/* <input
              className="input-zipcodeMain"
              type="text"
              ref={zipcode}
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
            /> */}
            <input
              className="input-zipcodeMain"
              type="text"
              name="zipcode"
              value={formData.zipcode}
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
        <div className="modify-group">
          <label className="modify-title">기본주소</label>
          {/* <input
            className="modify-input"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          /> */}
          <input
            className="modify-input"
            type="text"
            name="address"
            value={formData.address}
            readOnly
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
            // required
          />
        </div>
        <div className="modify-group">
          <label className="modify-title">프로필 사진</label>
          <input
            className="modify-input"
            type="file"
            name="profileImage"
            accept="images/*"
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
