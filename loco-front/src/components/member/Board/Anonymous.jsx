import { useState } from "react";
import "@/css/member/board/Qna.css";

const mockData = [
  {
    id: 1,
    title: "질문1",
    content: "답변1",
    writer: "김김김",
    createdDate: "2025-01-01",
  },
  {
    id: 2,
    title: "질문2",
    content: "답변2",
    writer: "박박박",
    createdDate: "2025-01-09",
  },
  {
    id: 3,
    title: "질문3",
    content: "답변3",
    writer: "이이이",
    createdDate: "2025-01-13",
  },
  {
    id: 4,
    title: "질문4",
    content: "답변4",
    writer: "최최최",
    createdDate: "2025-01-15",
  },
  {
    id: 5,
    title: "질문5",
    content: "답변5",
    writer: "정정정",
    createdDate: "2025-01-20",
  },
  {
    id: 6,
    title: "질문6",
    content: "답변6",
    writer: "윤윤윤",
    createdDate: "2025-01-25",
  },
  {
    id: 7,
    title: "질문7",
    content: "답변7",
    writer: "조조조",
    createdDate: "2025-01-30",
  },
  {
    id: 8,
    title: "질문8",
    content: "답변8",
    writer: "김김김",
    createdDate: "2025-02-01",
  },
  {
    id: 9,
    title: "질문9",
    content: "답변9",
    writer: "박박박",
    createdDate: "2025-02-05",
  },
  {
    id: 10,
    title: "질문10",
    content: "답변10",
    writer: "이이이",
    createdDate: "2025-02-10",
  },
  {
    id: 11,
    title: "질문11",
    content: "답변11",
    writer: "최최최",
    createdDate: "2025-02-15",
  },
  {
    id: 12,
    title: "질문12",
    content: "답변12",
    writer: "정정정",
    createdDate: "2025-02-20",
  },
];

const Anonymous = () => {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const toggleReply = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredData = mockData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = filteredData.sort((a, b) =>
    sortType === "oldest"
      ? new Date(a.createdDate) - new Date(b.createdDate)
      : new Date(b.createdDate) - new Date(a.createdDate)
  );

  // 페이징 처리
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
    <div className="list">
      <header className="header">익명 게시판</header>
      <div className="listBar">
        <select onChange={(e) => setSortType(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <input
          type="text"
          placeholder="검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="listTop">
        <table>
          <tbody>
            <tr>
              <td className="board-title">제목</td>
              <td className="board-writer">작성자</td>
              <td className="board-date">작성일</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {currentPosts.map((item) => (
          <div key={item.id}>
            <div className="question" onClick={() => toggleReply(item.id)}>
              <span className="board-title">{item.title}</span>
              <span className="board-writer">{item.writer}</span>
              <span className="board-date">{item.createdDate}</span>
            </div>
            {expandedId === item.id && (
              <div className="reply">{item.content}</div>
            )}
          </div>
        ))}
      </div>
      {/* 페이징 UI 추가 */}
      <div className="pagination">
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
            onClick={() => setCurrentPage(number)}
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

export default Anonymous;
