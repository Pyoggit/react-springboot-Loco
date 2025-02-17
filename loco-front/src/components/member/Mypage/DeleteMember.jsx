// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "@/css/member/mypage/DeleteMember.css";

// const DeleteMember = () => {
//   const navigate = useNavigate();

//   //더미 데이터
//   const loggedInUser = {
//     email: "test@example.com",
//     password: "password123", // 실제로는 비밀번호를 서버에서 확인해야 함
//   };

//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleDelete = () => {
//     if (password !== loggedInUser.password) {
//       setError("비밀번호가 올바르지 않습니다.");
//       return;
//     }

//     if (
//       window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
//     ) {
//       alert("회원 탈퇴가 완료되었습니다.");
//       // 실제로는 서버에서 탈퇴 API 호출
//       navigate("/"); // 메인 페이지로 이동
//     }
//   };

//   return (
//     <div className="delete-container">
//       {/* <div> */}
//       <h2>회원 탈퇴</h2>

//       <div className="delete-group">
//         <label className="delete-title">비밀번호 입력</label>
//         <input
//           className="delete-input"
//           type="password"
//           value={password}
//           onChange={handleChange}
//           placeholder="비밀번호를 입력하세요"
//           required
//         />
//       </div>

//       {error && <p className="error">{error}</p>}

//       <button className="delete-btn" onClick={handleDelete}>
//         회원 탈퇴
//       </button>
//     </div>
//   );
// };

// export default DeleteMember;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/mypage/DeleteMember.css";

const DeleteMember = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ 비밀번호 입력 변경 핸들러
  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  // ✅ 회원 탈퇴 요청
  const handleDelete = async () => {
    if (!password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    if (
      !window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }

    try {
      // ✅ 로컬스토리지에서 토큰 가져오기
      const normalAccessToken = localStorage.getItem("normal_accessToken");
      const kakaoAccessToken = localStorage.getItem("kakao_accessToken");

      let accessToken = normalAccessToken || kakaoAccessToken;
      if (!accessToken) {
        alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      // ✅ 백엔드 회원 탈퇴 API 호출
      const response = await axios.delete("/api/users/delete", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ 토큰 추가
        },
        data: { password }, // ✅ 비밀번호 추가
      });

      if (response.status === 200) {
        alert("회원 탈퇴가 완료되었습니다.");

        // ✅ 토큰 삭제 (로그아웃 처리)
        localStorage.removeItem("normal_accessToken");
        localStorage.removeItem("normal_refreshToken");
        localStorage.removeItem("kakao_accessToken");
        localStorage.removeItem("kakao_refreshToken");

        // ✅ 메인 페이지로 이동
        navigate("/");
      } else {
        setError("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("❌ 회원 탈퇴 실패:", error);

      if (error.response?.status === 401) {
        setError("비밀번호가 올바르지 않습니다.");
      } else {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="delete-container">
      <h2>회원 탈퇴</h2>

      <div className="delete-group">
        <label className="delete-title">비밀번호 입력</label>
        <input
          className="delete-input"
          type="password"
          value={password}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </div>

      {error && <p className="error">{error}</p>}

      <button className="delete-btn" onClick={handleDelete}>
        회원 탈퇴
      </button>
    </div>
  );
};

export default DeleteMember;
