import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/Qna.css";

const mockData = [
  {
    id: 1,
    title: "예시 질문",
    content: "",
    writer: "홍길동",
    createdDate: "2025-01-01",
    views: 100,
  },
];

const Faq = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [sortType, setSortType] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const postsPerPage = 10;

  const filteredData = mockData.filter((item) =>
    item[searchField].toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) =>
    sortType === "oldest"
      ? new Date(a.createdDate) - new Date(b.createdDate)
      : new Date(b.createdDate) - new Date(a.createdDate)
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

  const pageNumbers = Array.from(
    { length: Math.ceil(sortedData.length / postsPerPage) },
    (_, i) => i + 1
  );

  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < Math.ceil(sortedData.length / postsPerPage) &&
    setCurrentPage(currentPage + 1);

  return (
    <div className="qna-list">
      <header className="qna-header">
        FAQ (자주 묻는 질문)
        <button
          className="qna-write-button"
          onClick={() => navigate("/board/faq/new")}
        >
          글쓰기
        </button>
      </header>
      <div className="qna-listTop">
        <div className="qna-list-header">
          <div>
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="qna-sort"
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
          <div className="qna-listBar">
            <select
              onChange={(e) => setSearchField(e.target.value)}
              value={searchField}
            >
              <option value="title">제목</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              placeholder={`검색 (${
                searchField === "title" ? "제목" : "작성자"
              })`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="qna-list-content">
        {currentPosts.length > 0 ? (
          currentPosts.map((item) => (
            <div
              key={item.id}
              className="qna-post"
              onClick={() => navigate(`/board/faq/${item.id}`)}
            >
              <div className="qna-post-header">
                <span className="qna-board-title">{item.title}</span>
                <span className="qna-board-writer">{item.writer}</span>
                <span className="qna-board-date">{item.createdDate}</span>
                <span className="qna-board-views">{item.views} 조회</span>
              </div>
              <div className="qna-post-answer">
                {item.content ? (
                  item.content
                ) : (
                  <div className="no-answer">답변이 없습니다.</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>게시글이 없습니다.</p>
        )}
      </div>
      <div className="qna-pagination">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="qna-prev-next"
        >
          이전
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`qna-page-number ${
              number === currentPage ? "active" : ""
            }`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={goToNextPage}
          disabled={currentPage === Math.ceil(sortedData.length / postsPerPage)}
          className="qna-prev-next"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Faq;
