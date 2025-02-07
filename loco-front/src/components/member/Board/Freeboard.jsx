import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/Notice.css";

const mockData = [
  {
    id: 1,
    title: "제목1",
    content: "내용1",
    writer: "김김김",
    createdDate: new Date("2025-01-01").getTime(),
  },
  {
    id: 2,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-01-09").getTime(),
  },
  {
    id: 3,
    title: "제목3",
    content: "내용3",
    writer: "이이이",
    createdDate: new Date("2025-01-13").getTime(),
  },
  {
    id: 4,
    title: "제목4",
    content: "내용4",
    writer: "홍홍홍",
    createdDate: new Date("2025-01-14").getTime(),
  },
  {
    id: 5,
    title: "제목5",
    content: "내용5",
    writer: "최최최",
    createdDate: new Date("2025-01-15").getTime(),
  },
];

const Freeboard = () => {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();

  const onChangeSearch = (e) => setSearch(e.target.value);
  const onChangeSearchOpt = (e) => setSearchOpt(e.target.value);
  const onChangeSortType = (e) => setSortType(e.target.value);

  const getFilteredItems = () => {
    if (search === "") return mockData;
    return mockData.filter((item) =>
      item[searchOpt].toLowerCase().includes(search.toLowerCase())
    );
  };

  const sortedData = getFilteredItems().sort((a, b) =>
    sortType === "oldest"
      ? Number(a.createdDate) - Number(b.createdDate)
      : Number(b.createdDate) - Number(a.createdDate)
  );

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
        <div className="title">자유 게시판</div>
        <button
          className="notice-write-button"
          onClick={() => nav("/board/notice/new")}
        >
          글쓰기
        </button>
      </header>

      <div className="notice-listTopWrapper">
        <div className="notice-listTop">
          <div className="notice-sortSelect">
            <select onChange={onChangeSortType}>
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>
          </div>
          <div className="notice-searchBar">
            <select onChange={onChangeSearchOpt}>
              <option value="title">제목</option>
              <option value="writer">작성자</option>
            </select>
            <input
              type="text"
              placeholder="검색"
              value={search}
              onChange={onChangeSearch}
            />
          </div>
        </div>

        <table className="notice-list-header">
          <tbody>
            <tr>
              <td className="notice-board-title">글제목</td>
              <td className="notice-board-writer">작성자</td>
              <td className="notice-board-date">작성일</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        {currentPosts.map((item) => (
          <div
            key={item.id}
            className="notice-board-item"
            onClick={() => nav(`/board/notice/${item.id}`)} // 클릭 시 해당 글로 이동
          >
            <span className="notice-board-title">{item.title}</span>
            <span className="notice-board-writer">{item.writer}</span>
            <span className="notice-board-date">
              {new Date(item.createdDate).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>

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

export default Freeboard;
