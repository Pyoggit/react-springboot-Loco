import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/admin/NoticeManager.css";

const NoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate();

  // ✅ 공지사항 목록 불러오기
  useEffect(() => {
    axios
      .get("/api/board/notice")
      .then((response) => setNotices(response.data))
      .catch((error) => console.error("공지사항 불러오기 실패:", error));
  }, []);

  // ✅ 공지 추가 버튼 클릭 시 /board/new 로 이동
  const handleAddNotice = () => {
    navigate("/board/new");
  };

  // ✅ 공지 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/board/notice/${id}`);
        setNotices(notices.filter((notice) => notice.boardId !== id));
      } catch (error) {
        console.error("공지 삭제 실패:", error);
      }
    }
  };

  return (
    <div className="admin-notice-container">
      <button onClick={handleAddNotice}>공지 추가</button>
      <table className="admin-notice-table">
        <thead>
          <tr>
            <th>공지 ID</th>
            <th>제목</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.boardId}>
              <td>{notice.boardId}</td>
              <td>{notice.title}</td>
              <td>{new Date(notice.boardRegdate).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => navigate(`/board/edit/${notice.boardId}`)}
                >
                  수정
                </button>
                <button onClick={() => handleDelete(notice.boardId)}>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeManager;
