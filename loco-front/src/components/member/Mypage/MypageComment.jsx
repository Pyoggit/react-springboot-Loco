// import React, { useState, useEffect } from "react";
// import { Link, Route, Routes, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "@/css/member/mypage/MypageComment.css"; // 기존 스타일 파일 사용

// const MypageComment = () => {
//   const [userComments, setUserComments] = useState([]);
//   const [selectedType, setSelectedType] = useState(""); // ""이면 전체 댓글 표시 (백엔드 호출 시 빈 값이면 목록 없음)
//   const [currentPage, setCurrentPage] = useState(1);
//   const commentsPerPage = 10;
//   const navigate = useNavigate();

//   // 선택한 타입에 따라 백엔드에서 댓글 목록 불러오기
//   useEffect(() => {
//     if (selectedType) {
//       axios
//         .get(
//           `${import.meta.env.VITE_API_URL}/api/board/${selectedType}/comments`
//         )
//         .then((response) => {
//           setUserComments(response.data);
//           setCurrentPage(1); // 타입 변경 시 페이지 초기화
//         })
//         .catch((error) => {
//           console.error("댓글 불러오기 실패:", error);
//           setUserComments([]);
//         });
//     } else {
//       setUserComments([]);
//     }
//   }, [selectedType]);

//   // 페이지네이션 계산
//   const indexOfLastComment = currentPage * commentsPerPage;
//   const indexOfFirstComment = indexOfLastComment - commentsPerPage;
//   const currentComments = userComments.slice(
//     indexOfFirstComment,
//     indexOfLastComment
//   );
//   const totalPages = Math.ceil(userComments.length / commentsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);
//   const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
//   const goToNextPage = () =>
//     currentPage < totalPages && setCurrentPage(currentPage + 1);

//   // type 선택 시 페이지 초기화
//   const handleTypeChange = (e) => {
//     setSelectedType(e.target.value);
//     setCurrentPage(1);
//   };

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/mypage/MypageComment.css";

const MypageComment = () => {
  const [userComments, setUserComments] = useState([]); // ✅ 기본값 빈 배열
  const [selectedType, setSelectedType] = useState(""); // ✅ 선택된 게시판 타입
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // ✅ 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("normal_accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/mypage`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.userId) {
          setUserId(response.data.userId);
          console.log("✅ 로그인한 사용자 ID:", response.data.userId);
        } else {
          console.error("❌ 사용자 정보를 가져오지 못함:", response.data);
        }
      } catch (error) {
        console.error("❌ 로그인 사용자 정보 가져오기 실패:", error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // ✅ 선택한 타입의 댓글 불러오기 (전체 포함)
  useEffect(() => {
    if (!userId) return;

    const fetchComments = async () => {
      const token = localStorage.getItem("normal_accessToken");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const url =
          selectedType.trim() === ""
            ? `${import.meta.env.VITE_API_URL}/api/board/comments/${userId}` // 전체 댓글 조회
            : `${
                import.meta.env.VITE_API_URL
              }/api/board/${selectedType}/comments/${userId}`; // 특정 게시판 댓글 조회

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ 댓글 API 응답 데이터:", response.data);

        // ✅ API 응답이 배열이 아닐 경우 빈 배열로 설정
        setUserComments(Array.isArray(response.data) ? response.data : []);
        setCurrentPage(1);
      } catch (error) {
        console.error("❌ 댓글 불러오기 실패:", error);
        setUserComments([]); // 🚨 오류 발생 시 빈 배열로 설정
      }
    };

    fetchComments();
  }, [selectedType, userId, navigate]);

  // ✅ 페이지네이션 계산
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = userComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );
  const totalPages = Math.ceil(userComments.length / commentsPerPage);

  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="mypage-comment">
      <header className="mypage-comment-header">
        <h2>내가 작성한 댓글</h2>
        <div className="mypage-comment-filter">
          <label htmlFor="typeSelect">게시판 선택: </label>
          <select
            id="typeSelect"
            value={selectedType}
            onChange={handleTypeChange}
          >
            <option value="">전체</option>
            <option value="freeboard">자유</option>
            <option value="notice">공지사항</option>
            <option value="report">신고</option>
            <option value="improvement">불편&개선</option>
            <option value="qna">Q&A</option>
            <option value="faq">FAQ</option>
          </select>
        </div>
      </header>

      <table className="admin-freeboard-table">
        <thead>
          <tr>
            <th>이메일</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.length > 0 ? (
            currentComments.map((comment) => (
              <tr key={comment.commentId}>
                <td>{comment.userId}</td>
                <td>{comment.content}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-posts">
                작성한 댓글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mypage-comment-pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          이전
        </button>
        <span className="page-number">
          {currentPage} / {totalPages || 1}
        </span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageComment;
