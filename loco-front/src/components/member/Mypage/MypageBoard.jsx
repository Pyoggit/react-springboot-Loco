// import React from "react";
// import { Link, Route, Routes } from "react-router-dom";

// const MypageBoard = () => {
//   return <div>MypageBoard</div>;
// };

// export default MypageBoard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/myPage/MypageBoard.css";
// import "@/css/member/board/Notice.css";

const MypageBoard = () => {
  const [posts, setPosts] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // 빈 값이면 게시판 미선택 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName");

  // 선택한 타입에 따라 게시글 목록 불러오기
  useEffect(() => {
    if (selectedType) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/board/${selectedType}`)
        .then((response) => {
          setPosts(response.data);
          setCurrentPage(1); // 타입 변경 시 페이지 초기화
        })
        .catch((error) => {
          console.error("게시글 불러오기 실패:", error);
          setPosts([]);
        });
    } else {
      // 타입 미선택이면 빈 배열 또는 별도 API 호출
      setPosts([]);
    }
  }, [selectedType]);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
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
            <option value="">선택하세요</option>
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
        <thead className="admin-freeboard-table-thead">
          <tr>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        {/* <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr
                key={post.boardId}
                onClick={() =>
                  navigate(`/board/${selectedType}/view/${post.boardId}`)
                }
              >
                <td>{post.title}</td>
                <td>{userName}</td>
                <td>{new Date(post.boardRegdate).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-posts">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody> */}
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr
                key={post.boardId}
                onClick={() =>
                  navigate(`/board/${selectedType}/view/${post.boardId}`)
                }
              >
                <td>{post.title}</td>
                <td>{userName}</td>
                <td>{new Date(post.boardRegdate).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))
          ) : (
            <tr>
              {/* ✅ 테이블 헤더 개수에 맞게 colspan 설정 → 레이아웃 유지됨 */}
              <td colSpan="4" className="no-posts">
                게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* <div className="mypage-board-pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        ))}
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div> */}
      <div className="mypage-board-pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="page-number">
          {currentPage} / {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages || 1))
          }
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageBoard;
