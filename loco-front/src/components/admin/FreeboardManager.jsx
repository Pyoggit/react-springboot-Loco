import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/css/admin/ProductManager.css"; // 기존 CSS 파일 사용

const FreeboardManager = () => {
  const [boards, setBoards] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // 빈 값이면 전체 게시글 출력
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedBoards, setSelectedBoards] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 선택한 타입에 따라 게시글 목록 불러오기
  // selectedType이 빈 값이면 전체 조회 (/api/board/all), 아니면 해당 타입 조회 (/api/board/{type})
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        let url = "";
        if (selectedType === "") {
          url = `${import.meta.env.VITE_API_URL}/api/board/all`;
        } else {
          url = `${import.meta.env.VITE_API_URL}/api/board/${selectedType}`;
        }
        const response = await axios.get(url);
        setBoards(response.data);
        setCurrentPage(1);
        setSelectedBoards(new Set());
        setSelectAll(false);
      } catch (error) {
        console.error("게시글 목록 불러오기 실패:", error);
        setBoards([]);
      }
    };

    fetchBoards();
  }, [selectedType]);

  // 페이지네이션 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBoards = boards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(boards.length / itemsPerPage));

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // 개별 체크박스 토글
  const handleCheckboxChange = (boardId) => {
    setSelectedBoards((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(boardId)) {
        updated.delete(boardId);
      } else {
        updated.add(boardId);
      }
      setSelectAll(updated.size === boards.length);
      return updated;
    });
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBoards(new Set());
      setSelectAll(false);
    } else {
      const allIds = boards.map((board) => board.boardId);
      setSelectedBoards(new Set(allIds));
      setSelectAll(true);
    }
  };

  // 선택한 게시글 삭제 (API 호출)
  const handleDeleteSelected = async () => {
    if (selectedBoards.size === 0) {
      alert("삭제할 게시글을 선택하세요.");
      return;
    }
    if (!window.confirm("선택한 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/board/remove`, {
        data: { boardIds: Array.from(selectedBoards) },
      });
      alert("선택한 게시글이 삭제되었습니다.");
      // 삭제 후 목록 갱신
      setBoards((prevBoards) =>
        prevBoards.filter((board) => !selectedBoards.has(board.boardId))
      );
      setSelectedBoards(new Set());
      setSelectAll(false);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="admin-product-container">
      <div className="admin-product-header">
        {/* 검색 입력 대신 게시판 타입 선택 드롭다운 */}
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">전체</option>
          <option value="freeboard">자유</option>
          <option value="notice">공지사항</option>
          <option value="report">신고</option>
          <option value="improvement">불편&개선</option>
          <option value="qna">qna</option>
          <option value="faq">faq</option>
        </select>
        <button
          className="admin-product-delete-btn"
          onClick={handleDeleteSelected}
        >
          삭제
        </button>
      </div>

      <table className="admin-product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>게시글코드</th>
            <th>타입</th>
            <th>제목</th>
            {/* 작성자 칼럼 제거 */}
            <th>작성자 이메일</th>
            <th>내용</th>
            <th>조회수</th>
            <th>등록일자</th>
          </tr>
        </thead>
        <tbody>
          {currentBoards.length > 0 ? (
            currentBoards.map((board) => (
              <tr key={board.boardId}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBoards.has(board.boardId)}
                    onChange={() => handleCheckboxChange(board.boardId)}
                  />
                </td>
                <td>{board.boardId}</td>
                <td>{board.type}</td>
                <td>{board.title}</td>
                {/* 작성자 칼럼 제거 */}
                <td>{board.userEmail}</td>
                <td>{board.content}</td>
                <td>{board.views}</td>
                <td>{new Date(board.boardRegdate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-posts">
                등록된 게시글이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="page-number">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default FreeboardManager;
