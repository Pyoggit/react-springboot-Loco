import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/Notice.css";

const Faq = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();
  const userName = localStorage.getItem("userName");

  // 관리자가 작성하는 FAQ 목업데이터 8개 (이메일은 admin@naver.com)
  const mockPosts = [
    {
      boardId: 6001,
      title: "서비스 이용 시간은 어떻게 되나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-22T10:00:00",
      views: 120,
      type: "faq"
    },
    {
      boardId: 6002,
      title: "회원가입 시 필요한 정보는 무엇인가요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-21T11:15:00",
      views: 95,
      type: "faq"
    },
    {
      boardId: 6003,
      title: "비밀번호 분실 시 어떻게 복구하나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-20T12:30:00",
      views: 80,
      type: "faq"
    },
    {
      boardId: 6004,
      title: "이용 약관은 어디서 확인할 수 있나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-19T13:45:00",
      views: 70,
      type: "faq"
    },
    {
      boardId: 6005,
      title: "문의사항은 어디로 보내야 하나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-18T14:00:00",
      views: 65,
      type: "faq"
    },
    {
      boardId: 6006,
      title: "서비스 이용 중 오류가 발생하면?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-17T15:30:00",
      views: 55,
      type: "faq"
    },
    {
      boardId: 6007,
      title: "개인정보 보호 정책은 어떻게 되나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-16T16:45:00",
      views: 50,
      type: "faq"
    },
    {
      boardId: 6008,
      title: "FAQ 업데이트 주기는 어떻게 되나요?",
      userEmail: "admin@naver.com",
      boardRegdate: "2025-02-15T17:00:00",
      views: 45,
      type: "faq"
    }
  ];

  // 게시글 목록 불러오기 (실제 API와 목업데이터 합치기)
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/faq`
      );
      setPosts([...response.data, ...mockPosts]);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
      setPosts([...mockPosts]);
    }
  };

  useEffect(() => {
    console.log(
      "***********************************✅ 저장된 userId:",
      localStorage.getItem("userId")
    );
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
  const goToPrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
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
        <div className="notice-title">FAQ(자주 묻는 질문)</div>
        <button
          className="notice-write-button"
          onClick={() => nav("/board/faq/new")}
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

export default Faq;
