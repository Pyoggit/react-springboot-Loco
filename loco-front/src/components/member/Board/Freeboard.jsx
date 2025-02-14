import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/Notice.css";

const Freeboard = () => {
  const [boards, setBoards] = useState([]); // API로부터 받은 게시글 목록
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();

  // 컴포넌트가 마운트되면 백엔드 API에서 자유게시판 목록을 불러옴
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/board/freeboard`)
      .then((response) => {
        // 응답 데이터는 Board 객체 배열이라고 가정 (예: boardId, title, writer, boardRegdate, views 등)
        setBoards(response.data);
      })
      .catch((error) => {
        console.error("자유게시판 목록 조회 실패:", error);
      });
  }, []);

  const onChangeSearch = (e) => setSearch(e.target.value);
  const onChangeSearchOpt = (e) => setSearchOpt(e.target.value);
  const onChangeSortType = (e) => setSortType(e.target.value);

  const getFilteredItems = () => {
    if (search === "") return boards;
    return boards.filter((item) =>
      item[searchOpt].toLowerCase().includes(search.toLowerCase())
    );
  };

  const sortedData = getFilteredItems().sort((a, b) =>
    sortType === "oldest"
      ? new Date(a.boardRegdate) - new Date(b.boardRegdate)
      : new Date(b.boardRegdate) - new Date(a.boardRegdate)
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

  // 게시글 클릭 시 상세 페이지로 이동 (백엔드 상세 조회 시 조회수 증가 처리)
  const handlePostClick = (item) => {
    nav(`/board/freeboard/freeview/${item.boardId}`);
  };

  return (
    <div className="notice-list">
      <header className="notice-header">
        <div className="notice-title">자유 게시판</div>
        <button
          className="notice-write-button"
          onClick={() => nav("/board/freeboard/new")}
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
              <td className="notice-board-views">조회수</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        {currentPosts.map((item) => (
          <div
            key={item.boardId}
            className="notice-board-item"
            onClick={() => handlePostClick(item)}
          >
            <span className="notice-board-title">{item.title}</span>
            <span className="notice-board-writer">{item.writer}</span>
            <span className="notice-board-date">
              {new Date(item.boardRegdate).toLocaleDateString()}
            </span>
            <span className="notice-board-views">{item.views}</span>
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
