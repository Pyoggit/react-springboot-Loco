import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/Notice.css";

const Report = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();
  const userName = localStorage.getItem("userName");

  // ✅ 게시글 목록 불러오기

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/report`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    console.log(
      "***********************************✅ 저장된 userId:",
      localStorage.getItem("userId")
    );

    fetchPosts();
  }, []);

  // ✅ 검색 필터링
  const getFilteredItems = () => {
    if (search === "") return posts;
    return posts.filter((item) =>
      item[searchOpt].toLowerCase().includes(search.toLowerCase())
    );
  };

  // ✅ 정렬 (최신순 / 오래된순)
  const sortedData = getFilteredItems().sort((a, b) =>
    sortType === "oldest"
      ? new Date(a.boardRegdate) - new Date(b.boardRegdate)
      : new Date(b.boardRegdate) - new Date(a.boardRegdate)
  );

  // ✅ 페이지네이션
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < Math.ceil(sortedData.length / postsPerPage) &&
    setCurrentPage(currentPage + 1);

  const pageNumbers = Array.from(
    { length: Math.ceil(sortedData.length / postsPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className="notice-list">
      <header className="notice-header">
        <div className="notice-title">신고하기</div>
        <button
          className="notice-write-button"
          onClick={() => nav("/board/report/new")}
        >
          글쓰기
        </button>
      </header>
      <div className="notice-listTopWrapper">
        <div className="notice-listTop">
          <div className="notice-sortSelect">
            <select onChange={(e) => setSortType(e.target.value)}>
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
          <div className="notice-searchBar">
            <select onChange={(e) => setSearchOpt(e.target.value)}>
              <option value="title">제목</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              placeholder="검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="notice-list-header">
          <tbody>
            <tr>
              <td className="notice-board-title">글제목</td>
              <td className="notice-board-writer">작성자</td>
              <td className="notice-board-date">작성일</td>
              <td className="notice-board-views">조회수</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ✅ 게시글 목록 */}
      <div>
        {currentPosts.length > 0 ? (
          currentPosts.map((item) => (
            <div
              key={item.boardId}
              className="notice-board-item"
              onClick={() => nav(`/board/${item.type}/${item.boardId}`)}
            >
              <span className="notice-board-title">{item.title}</span>
              <span className="notice-board-writer">{item.userEmail}</span>
              <span className="notice-board-date">
                {new Date(item.boardRegdate).toLocaleDateString()}
              </span>
              <span className="notice-board-views">{item.views}</span>
            </div>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>

      {/* ✅ 페이지네이션 */}
      <div className="notice-pagination">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="prev-next"
        >
          이전
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`page-number ${number === currentPage ? "active" : ""}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(sortedData.length / postsPerPage)}
          className="prev-next"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Report;
