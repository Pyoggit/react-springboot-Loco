import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import 해야 합니다
import "@/css/member/board/Qna.css";

const mockData = [
  {
    id: 1,
    title: "질문1",
    content: "ㄴㅇㄹㄴㅇㄹㄴㅇㄹ",
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
  // 추가된 데이터들
  {
    id: 13,
    title: "질문13",
    content: "답변13",
    writer: "김김김",
    createdDate: "2025-02-25",
  },
  {
    id: 14,
    title: "질문14",
    content: "답변14",
    writer: "박박박",
    createdDate: "2025-02-26",
  },
  {
    id: 15,
    title: "질문15",
    content: "답변15",
    writer: "이이이",
    createdDate: "2025-02-27",
  },
  {
    id: 16,
    title: "질문16",
    content: "답변16",
    writer: "최최최",
    createdDate: "2025-02-28",
  },
  {
    id: 17,
    title: "질문17",
    content: "답변17",
    writer: "정정정",
    createdDate: "2025-03-01",
  },
  {
    id: 18,
    title: "질문18",
    content: "답변18",
    writer: "윤윤윤",
    createdDate: "2025-03-02",
  },
  {
    id: 19,
    title: "질문19",
    content: "답변19",
    writer: "조조조",
    createdDate: "2025-03-03",
  },
  {
    id: 20,
    title: "질문20",
    content: "답변20",
    writer: "김김김",
    createdDate: "2025-03-04",
  },
  {
    id: 21,
    title: "질문21",
    content: "답변21",
    writer: "박박박",
    createdDate: "2025-03-05",
  },
  {
    id: 22,
    title: "질문22",
    content: "답변22",
    writer: "이이이",
    createdDate: "2025-03-06",
  },
  {
    id: 23,
    title: "질문23",
    content: "답변23",
    writer: "최최최",
    createdDate: "2025-03-07",
  },
  {
    id: 24,
    title: "질문24",
    content: "답변24",
    writer: "정정정",
    createdDate: "2025-03-08",
  },
  {
    id: 25,
    title: "질문25",
    content: "답변25",
    writer: "윤윤윤",
    createdDate: "2025-03-09",
  },
];

const Qna = () => {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [sortType, setSortType] = useState("latest");
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isWriting, setIsWriting] = useState(false); // 글쓰기 폼을 열고 닫을 상태

  const navigate = useNavigate();

  const postsPerPage = 10;
  const onChangeSortType = (e) => setSortType(e.target.value);
  const toggleReply = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredData = mockData.filter((item) =>
    item[searchField].toLowerCase().includes(search.toLowerCase())
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

  const openWritePost = () => {
    setIsWriting(true); // 글쓰기 폼을 여는 상태로 설정
  };

  return (
    <div className="qna-list">
      <header className="qna-header">
        Q&A
        <button
          className="qna-write-button"
          onClick={() => navigate("/board/qna/qnanew")} // navigate 함수로 변경
        >
          글쓰기
        </button>
      </header>
      <div className="qna-listTop">
        <div className="qna-list-header">
          <div>
            <select onChange={onChangeSortType} className="qna-sort">
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
      <div className="qna-listTop">
        <table>
          <tbody>
            <tr>
              <td className="qna-board-title"> 궁금한 질문</td>
              <td className="qna-board-writer">작성자</td>
              <td className="qna-board-date">작성일</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {currentPosts.map((item) => (
          <div key={item.id}>
            <div className="qna-question" onClick={() => toggleReply(item.id)}>
              <span className="qna-board-title">{item.title}</span>
              <span className="qna-board-writer">{item.writer}</span>
              <span className="qna-board-date">{item.createdDate}</span>
            </div>
            {expandedId === item.id && (
              <div className="qna-reply">{item.content}</div>
            )}
          </div>
        ))}
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

export default Qna;
