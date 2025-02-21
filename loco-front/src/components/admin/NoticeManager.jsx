import React, { useState, useEffect } from "react";
import axios from "axios";
import "@/css/admin/ProductManager.css"; // 기존 CSS 파일 사용

const NoticeManager = () => {
  const [boards, setBoards] = useState([]);
  const [selectedType, setSelectedType] = useState(""); // 빈 값이면 전체 게시글 출력
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // 각 게시글의 댓글을 저장하는 객체: { boardId: [댓글 객체, ...] }
  const [boardComments, setBoardComments] = useState({});
  // 삭제할 댓글 선택 상태 (댓글 ID)
  const [selectedComments, setSelectedComments] = useState(new Set());
  const [selectAllComments, setSelectAllComments] = useState(false);

  const userName = localStorage.getItem("userName");

  // 게시글 목록 불러오기 (selectedType이 빈 값이면 전체 조회)
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
        // 댓글 데이터 초기화
        setBoardComments({});
        setSelectedComments(new Set());
        setSelectAllComments(false);
      } catch (error) {
        console.error("게시글 목록 불러오기 실패:", error);
        setBoards([]);
      }
    };

    fetchBoards();
  }, [selectedType]);

  // 게시글 목록이 바뀌면 각 게시글의 댓글 불러오기 (상세 조회 API를 통해 댓글 목록 포함)
  // 그리고 댓글이 없는 게시글은 boards 목록에서 제거합니다.
  useEffect(() => {
    const fetchCommentsForBoards = async () => {
      const newMapping = {};
      await Promise.all(
        boards.map(async (board) => {
          try {
            const response = await axios.get(
              `${import.meta.env.VITE_API_URL}/api/board/${board.type}/${board.boardId}`
            );
            // 응답 구조: { board: { ... }, comments: [ ... ] }
            newMapping[board.boardId] = response.data.comments || [];
          } catch (error) {
            console.error(`게시글 ${board.boardId} 댓글 불러오기 실패:`, error);
            newMapping[board.boardId] = [];
          }
        })
      );
      setBoardComments(newMapping);
      // 댓글이 하나도 없는 게시글은 화면 목록에서 제거 (DB에서는 삭제되지 않음)
      setBoards((prevBoards) =>
        prevBoards.filter(
          (board) =>
            newMapping[board.boardId] && newMapping[board.boardId].length > 0
        )
      );
    };

    if (boards.length > 0) {
      fetchCommentsForBoards();
    }
  }, [boards]);

  // 페이지네이션 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentBoards = boards.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.max(1, Math.ceil(boards.length / itemsPerPage));

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1);
  };

  // 댓글 개별 체크박스 토글
  const handleCommentCheckboxChange = (commentId) => {
    setSelectedComments((prevSelected) => {
      const updated = new Set(prevSelected);
      if (updated.has(commentId)) {
        updated.delete(commentId);
      } else {
        updated.add(commentId);
      }
      // 현재 페이지에 보이는 모든 댓글 ID 수로 전체 선택 여부 업데이트
      const allCommentIds = currentBoards.reduce((acc, board) => {
        const comments = boardComments[board.boardId] || [];
        return acc.concat(comments.map((c) => c.commentId));
      }, []);
      setSelectAllComments(
        updated.size === allCommentIds.length && allCommentIds.length > 0
      );
      return updated;
    });
  };

  // 현재 페이지에 보이는 댓글 전체 선택/해제
  const handleSelectAllComments = () => {
    const allCommentIds = currentBoards.reduce((acc, board) => {
      const comments = boardComments[board.boardId] || [];
      return acc.concat(comments.map((c) => c.commentId));
    }, []);
    if (selectAllComments) {
      setSelectedComments(new Set());
      setSelectAllComments(false);
    } else {
      setSelectedComments(new Set(allCommentIds));
      setSelectAllComments(true);
    }
  };

  // 선택한 댓글 삭제 (API 호출)
  const handleDeleteSelectedComments = async () => {
    if (selectedComments.size === 0) {
      alert("삭제할 댓글을 선택하세요.");
      return;
    }
    if (!window.confirm("선택한 댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/board/comments/remove`,
        { data: { commentIds: Array.from(selectedComments) } }
      );
      alert("선택한 댓글이 삭제되었습니다.");
      // 삭제 후, boardComments 상태 업데이트: 각 게시글의 댓글 목록에서 삭제된 댓글 제거
      const updatedMapping = { ...boardComments };
      Object.keys(updatedMapping).forEach((boardId) => {
        updatedMapping[boardId] = updatedMapping[boardId].filter(
          (comment) => !selectedComments.has(comment.commentId)
        );
      });
      setBoardComments(updatedMapping);
      setSelectedComments(new Set());
      setSelectAllComments(false);
      // 댓글이 하나도 없는 게시글은 boards 목록에서 제거 (게시글 자체는 DB에서 삭제되지 않음)
      setBoards((prevBoards) =>
        prevBoards.filter(
          (board) =>
            updatedMapping[board.boardId] &&
            updatedMapping[board.boardId].length > 0
        )
      );
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="admin-product-container">
      <div className="admin-product-header">
        {/* 게시판 타입 선택 드롭다운 */}
        <select value={selectedType} onChange={handleTypeChange}>
          <option value="">전체</option>
          <option value="freeboard">자유</option>
          <option value="notice">공지사항</option>
          <option value="report">신고</option>
          <option value="improvement">불편&개선</option>
          <option value="qna">qna</option>
          <option value="faq">faq</option>
        </select>
        {/* 선택한 댓글 삭제 버튼 */}
        <button
          className="admin-product-delete-btn"
          onClick={handleDeleteSelectedComments}
        >
          선택 댓글 삭제
        </button>
        {/* 현재 페이지 댓글 전체 선택 체크박스 */}
        <label style={{ marginLeft: "20px" }}>
          <input
            type="checkbox"
            checked={selectAllComments}
            onChange={handleSelectAllComments}
          />{" "}
          전체 댓글 선택
        </label>
      </div>

      <table className="admin-product-table">
        <thead>
          <tr>
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
              <React.Fragment key={board.boardId}>
                <tr style={{ backgroundColor: "#eef" }}>
                  <td>{board.boardId}</td>
                  <td>{board.type}</td>
                  <td>{board.title}</td>
                  {/* 작성자 칼럼 제거 */}
                  <td>{board.userEmail}</td>
                  <td>{board.content}</td>
                  <td>{board.views}</td>
                  <td>{new Date(board.boardRegdate).toLocaleDateString()}</td>
                </tr>
                {boardComments[board.boardId] &&
                  boardComments[board.boardId].length > 0 && (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          backgroundColor: "#f9f9f9",
                          paddingLeft: "20px",
                        }}
                      >
                        {boardComments[board.boardId].map((comment) => (
                          <div
                            key={comment.commentId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              borderBottom: "1px solid #ddd",
                              padding: "5px 0",
                            }}
                          >
                            <input
                              type="checkbox"
                              style={{ marginRight: "10px" }}
                              checked={selectedComments.has(comment.commentId)}
                              onChange={() =>
                                handleCommentCheckboxChange(comment.commentId)
                              }
                            />
                            <span>
                              <strong>{comment.userEmail}</strong>:{" "}
                              {comment.content}{" "}
                              <span
                                style={{ fontSize: "0.8em", color: "#666" }}
                              >
                                (
                                {new Date(comment.regdate).toLocaleDateString()}
                                )
                              </span>
                            </span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-posts">
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

export default NoticeManager;
