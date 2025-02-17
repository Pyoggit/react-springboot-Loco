// import React from "react";
// import { Link, Route, Routes } from "react-router-dom";

// const MypageBoard = () => {
//   return <div>MypageBoard</div>;
// };

// export default MypageBoard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/Notice.css"; // 스타일 파일 추가

const MypageBoard = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 로컬스토리지에서 사용자가 작성한 글 가져오기
    const storedUserPosts = localStorage.getItem("userPosts");
    if (storedUserPosts) {
      setUserPosts(JSON.parse(storedUserPosts));
    }
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < Math.ceil(userPosts.length / postsPerPage) &&
    setCurrentPage(currentPage + 1);

  const pageNumbers = Array.from(
    { length: Math.ceil(userPosts.length / postsPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className="mypage-board">
      <header className="mypage-board-header">
        <h2>내가 작성한 글</h2>
      </header>

      <table className="mypage-board-list">
        <thead>
          <tr>
            <th>제목</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr
                key={post.id}
                onClick={() => navigate(`/board/freeboard/freeview/${post.id}`)}
              >
                <td>{post.title}</td>
                <td>{new Date(post.createdDate).toLocaleDateString()}</td>
                <td>{post.views}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-posts">
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
          disabled={currentPage === Math.ceil(userPosts.length / postsPerPage)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageBoard;
