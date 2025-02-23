import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/Notice.css";

const Improvement = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();
  const userName = localStorage.getItem("userName");

  // Improvement 게시판용 목업데이터 8개
  const mockPosts = [
    {
      boardId: 3001,
      title: "사이트 로딩 속도 개선 요청",
      userEmail: "kim@naver.com",
      boardRegdate: "2025-02-22T08:00:00",
      views: 12,
      type: "improvement",
    },
    {
      boardId: 3002,
      title: "모바일 인터페이스 개선 필요",
      userEmail: "lee@daum.net",
      boardRegdate: "2025-02-21T09:30:00",
      views: 8,
      type: "improvement",
    },
    {
      boardId: 3003,
      title: "오류 메시지 수정 요청",
      userEmail: "park@gmail.com",
      boardRegdate: "2025-02-20T10:15:00",
      views: 5,
      type: "improvement",
    },
    {
      boardId: 3004,
      title: "UI 불편 개선 건의",
      userEmail: "choi@hanmail.net",
      boardRegdate: "2025-02-19T11:45:00",
      views: 7,
      type: "improvement",
    },
    {
      boardId: 3005,
      title: "검색 기능 오류 개선 요청",
      userEmail: "jung@naver.com",
      boardRegdate: "2025-02-18T12:00:00",
      views: 4,
      type: "improvement",
    },
    {
      boardId: 3006,
      title: "공지사항 업데이트 제안",
      userEmail: "yoon@gmail.com",
      boardRegdate: "2025-02-17T13:30:00",
      views: 6,
      type: "improvement",
    },
    {
      boardId: 3007,
      title: "FAQ 추가 건의",
      userEmail: "lim@daum.net",
      boardRegdate: "2025-02-16T14:45:00",
      views: 3,
      type: "improvement",
    },
    {
      boardId: 3008,
      title: "사용자 피드백 반영 요청",
      userEmail: "seo@hanmail.net",
      boardRegdate: "2025-02-15T15:00:00",
      views: 9,
      type: "improvement",
    },
  ];

  // 실제 API에서 게시글을 불러오고 목업데이터와 합치기
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/improvement`
      );
      setPosts([...response.data, ...mockPosts]);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      setPosts([...mockPosts]);
    }
  };

  useEffect(() => {
    console.log("저장된 userId:", localStorage.getItem("userId"));
    fetchPosts();
  }, []);

  // 검색 필터링
  const getFilteredItems = () => {
    if (search === "") return posts;
    return posts.filter((item) =>
      item[searchOpt].toLowerCase().includes(search.toLowerCase())
    );
  };

  // 정렬 (최신순 / 오래된순)
  const sortedData = getFilteredItems().sort((a, b) =>
    sortType === "oldest"
      ? new Date(a.boardRegdate) - new Date(b.boardRegdate)
      : new Date(b.boardRegdate) - new Date(a.boardRegdate)
  );

  // 페이지네이션 계산
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
        <div className="notice-title">불편 & 개선사항</div>
        <button
          className="notice-write-button"
          onClick={() => nav("/board/improvement/new")}
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
              <option value="userEmail">이메일</option>
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
              <td className="notice-board-writer">이메일</td>
              <td className="notice-board-date">작성일</td>
              <td className="notice-board-views">조회수</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* 게시글 목록 */}
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
      {/* 페이지네이션 */}
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

export default Improvement;
