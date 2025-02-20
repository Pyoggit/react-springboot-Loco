// import React from "react";
// import { Link, Route, Routes } from "react-router-dom";

// const MypageBoard = () => {
//   return <div>MypageBoard</div>;
// };

// export default MypageBoard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/Notice.css"; // 기존 스타일 파일 사용

const MypageBoard = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // ""이면 전체 글 표시
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬스토리지에서 사용자가 작성한 글 가져오기
    const storedUserPosts = localStorage.getItem("userPosts");
    if (storedUserPosts) {
      setUserPosts(JSON.parse(storedUserPosts));
    }
  }, []);

  // 선택된 타입에 따라 글 필터링 (selectedType이 비어있으면 전체 글)
  const filteredPosts =
    selectedType === ""
      ? userPosts
      : userPosts.filter((post) => post.type === selectedType);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < Math.ceil(filteredPosts.length / postsPerPage) &&
    setCurrentPage(currentPage + 1);

  const pageNumbers = Array.from(
    { length: Math.ceil(filteredPosts.length / postsPerPage) },
    (_, i) => i + 1
  );

  // type 선택 시 페이지 초기화
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // 게시글 삭제 핸들러: 삭제 확인 후 해당 게시글을 상태와 로컬스토리지에서 제거
  const handleDelete = (id) => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      const updatedPosts = userPosts.filter(
        (post) => (post.id || post.code) !== id
      );
      setUserPosts(updatedPosts);
      localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
      alert("게시글이 삭제되었습니다.");
    }
  };

  return (
    <div className="mypage-board">
      <header className="mypage-board-header">
        <h2>내가 작성한 글</h2>
        <div className="mypage-board-filter">
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
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr
                key={post.id || post.code}
                onClick={() =>
                  navigate(`/board/${post.type}/view/${post.id || post.code}`)
                }
              >
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>
                  {new Date(post.createdDate || post.date).toLocaleDateString()}
                </td>
                <td>{post.views}</td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.id || post.code);
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-posts">
                작성한 글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mypage-board-pagination">
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
            currentPage === Math.ceil(filteredPosts.length / postsPerPage)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageBoard;
