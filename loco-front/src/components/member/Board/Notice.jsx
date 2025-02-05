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
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-01-14").getTime(),
  },
  {
    id: 5,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-01-15").getTime(),
  },
  {
    id: 6,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-23").getTime(),
  },
  {
    id: 7,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-24").getTime(),
  },
  {
    id: 8,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-25").getTime(),
  },
  {
    id: 9,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-26").getTime(),
  },
  {
    id: 10,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-27").getTime(),
  },
  {
    id: 11,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-28").getTime(),
  },
  {
    id: 12,
    title: "제목2",
    content: "내용2",
    writer: "박박박",
    createdDate: new Date("2025-02-29").getTime(),
  },
];

const Notice = () => {
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
    <div className="list">
      <header className="header">
        <div className="title">공지사항</div>
      </header>
      <div className="listBar">
        <select onChange={onChangeSortType}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <div>
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
      <div className="listTop">
        <table>
          <tbody>
            <tr>
              <td className="board-title">글제목</td>
              <td className="board-writer">작성자</td>
              <td className="board-date">작성일</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        {currentPosts.map((item) => (
          <div
            key={item.id}
            className="listItem"
            onClick={() => nav(`/view/${item.id}`)}
          >
            <span className="board-title">{item.title}</span>
            <span className="board-writer">{item.writer}</span>
            <span className="board-date">
              {new Date(item.createdDate).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
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

export default Notice;
