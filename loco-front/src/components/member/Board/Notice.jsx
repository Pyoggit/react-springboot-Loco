import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/Notice.css";

const Notice = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [searchOpt, setSearchOpt] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const nav = useNavigate();
  const userName = localStorage.getItem("userName");
  const [userRole, setUserRole] = useState(null); // ✅ API에서 가져온 유저 역할 저장

  // ✅ 로그인한 유저 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("/api/users/mypage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("normal_accessToken")}`,
        },
      });
      setUserRole(response.data.role); // ✅ role 값 저장
    } catch (error) {
      console.error("🚨 로그인 정보 불러오기 실패:", error);
      setUserRole(null); // 오류 발생 시 role 초기화
    }
  };
  // ✅ 공지사항 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/notice`
      );

      console.log("📌 API 응답 상태 코드:", response.status);
      console.log("📌 API 응답 데이터:", response.data);

      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("🚨 API 응답이 배열이 아님:", response.data);
        setPosts([]);
      }
    } catch (error) {
      console.error("🚨 게시글 불러오기 실패:", error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchPosts(); // ✅ 한 번만 호출
  }, []);

  // 검색 필터링
  const getFilteredItems = () => {
    if (!Array.isArray(posts)) {
      console.error("🚨 posts 데이터가 배열이 아님:", posts);
      return []; // ✅ posts가 배열이 아니면 빈 배열 반환
    }

    if (search === "") return posts;
    return posts.filter((item) =>
      item[searchOpt]?.toLowerCase().includes(search.toLowerCase())
    );
  };

  // 정렬 (최신순 / 오래된순)
  const sortedData = Array.isArray(getFilteredItems())
    ? getFilteredItems().sort((a, b) =>
        sortType === "oldest"
          ? new Date(a.boardRegdate) - new Date(b.boardRegdate)
          : new Date(b.boardRegdate) - new Date(a.boardRegdate)
      )
    : []; // ✅ getFilteredItems()가 배열이 아니면 빈 배열 반환

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
        <div className="notice-title">공지사항</div>
        {userRole === 1 && ( // ✅ 관리자만 "글쓰기" 버튼 보이게!
          <button
            className="notice-write-button"
            onClick={() => nav("/board/notice/new")}
          >
            글쓰기
          </button>
        )}
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

export default Notice;
