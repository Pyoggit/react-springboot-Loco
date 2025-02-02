import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/mypage/DeleteMember.css";

const DeleteMember = () => {
  const navigate = useNavigate();

  //더미 데이터
  const loggedInUser = {
    email: "test@example.com",
    password: "password123", // 실제로는 비밀번호를 서버에서 확인해야 함
  };

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleDelete = () => {
    if (password !== loggedInUser.password) {
      setError("비밀번호가 올바르지 않습니다.");
      return;
    }

    if (
      window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      alert("회원 탈퇴가 완료되었습니다.");
      // 실제로는 서버에서 탈퇴 API 호출
      navigate("/"); // 메인 페이지로 이동
    }
  };

  return (
    <div className="delete-container">
      <h2>회원 탈퇴</h2>

      <div className="group">
        <label className="title">비밀번호 입력</label>
        <input
          className="input"
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
