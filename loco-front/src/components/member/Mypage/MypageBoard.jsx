import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/myPage/MypageBoard.css";

const MypageBoard = () => {
  const [posts, setPosts] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // ✅ 내가 작성한 게시글만 불러오기 (API에서 모든 글 받아오고 프론트에서 필터링)
  useEffect(() => {
    if (selectedType) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/board/${selectedType}`)
        .then((response) => {
          setPosts(response.data); // 모든 글 받아옴
          setCurrentPage(1);
        })
        .catch((error) => {
          console.error("🚨 게시글 불러오기 실패:", error);
          setPosts([]);
        });
    } else {
      setPosts([]); // 게시판이 선택되지 않았을 때 초기화
    }
  }, [selectedType]);

  // ✅ 내가 작성한 글만 필터링
  const filteredPosts = posts.filter((post) => post.userId === Number(userId));

  // ✅ 수정된 페이지네이션 계산 (filteredPosts 사용)
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost); // ✅ 여기 수정!!

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage); // ✅ 여기도 filteredPosts로 수정!

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
            <th>이메일</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
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
                <td>{post.userEmail}</td>
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
        </tbody>
      </table>

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
