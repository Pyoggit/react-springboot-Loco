import React, { useState, useEffect } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "@/css/member/board/Notice.css"; // 기존 스타일 파일 사용

const MypageComment = () => {
  const [userComments, setUserComments] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // ""이면 전체 댓글 표시
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬스토리지에서 사용자가 작성한 댓글 가져오기 (예: "userComments")
    const storedUserComments = localStorage.getItem("userComments");
    if (storedUserComments) {
      setUserComments(JSON.parse(storedUserComments));
    }
  }, []);

  // 선택된 타입에 따라 댓글 필터링 (selectedType이 비어있으면 전체 댓글)
  const filteredComments =
    selectedType === ""
      ? userComments
      : userComments.filter((comment) => comment.type === selectedType);

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < Math.ceil(filteredComments.length / commentsPerPage) &&
    setCurrentPage(currentPage + 1);

  const pageNumbers = Array.from(
    { length: Math.ceil(filteredComments.length / commentsPerPage) },
    (_, i) => i + 1
  );

  // type 선택 시 페이지 초기화
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // 댓글 삭제 핸들러: 삭제 확인 후 상태와 로컬스토리지에서 해당 댓글 제거
  const handleDelete = (id) => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      const updatedComments = userComments.filter(
        (comment) => comment.id !== id
      );
      setUserComments(updatedComments);
      localStorage.setItem("userComments", JSON.stringify(updatedComments));
      alert("댓글이 삭제되었습니다.");
    }
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
            <option value="qna">qna</option>
            <option value="faq">faq</option>
          </select>
        </div>
      </header>

      <table className="admin-freeboard-table">
        <thead>
          <tr>
            <th>작성자</th>
            <th>내용</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentComments.length > 0 ? (
            currentComments.map((comment) => (
              <tr key={comment.id}>
                <td>{comment.writer}</td>
                <td>{comment.content}</td>
                <td>
                  <button onClick={() => handleDelete(comment.id)}>삭제</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-posts">
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
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={
            currentPage === Math.ceil(filteredComments.length / commentsPerPage)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageComment;
