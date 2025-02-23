import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/FreeView.css"; // 원래 CSS 파일명 그대로 사용
import qs from "qs";

const BoardView = () => {
  // URL에서 게시판 타입과 게시글 ID를 받아옵니다.
  const { type, boardId } = useParams();
  const [boardItem, setBoardItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [userMap, setUserMap] = useState({}); // ✅ userId -> userName 매핑 객체
  const nav = useNavigate();

  // userId 가져오기
  const myuserName = localStorage.getItem("userName");
  const myuserId = localStorage.getItem("userId");
  const myuserEmail = localStorage.getItem("userEmail");

  // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const getStringedDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  // const fetchUserNames = async (commentsData) => {
  //   if (!commentsData || commentsData.length === 0) return;

  //   const uniqueUserIds = [...new Set(commentsData.map((c) => c.userId))];

  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/api/users/getUserNames`,
  //       { userIds: uniqueUserIds }
  //     );

  //     console.log("📌 서버에서 받은 유저 데이터:", response.data);

  //     setUserMap(response.data);
  //   } catch (error) {
  //     console.error("유저 이름 가져오기 실패:", error);
  //   }
  // };

  const fetchUserNames = async (commentsData) => {
    if (!commentsData || commentsData.length === 0) return;

    const uniqueUserIds = [...new Set(commentsData.map((c) => c.userId))];

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/getUserNames`,
        {
          params: { userIds: uniqueUserIds.join(",") }, // 쉼표로 구분된 문자열로 변환
        }
      );

      console.log("📌 서버에서 받은 유저 데이터:", response.data);
      setUserMap(response.data);
    } catch (error) {
      console.error("유저 이름 가져오기 실패:", error);
    }
  };

  // 게시글 및 댓글 데이터 백엔드 API에서 받아오기 (조회수 1 증가 포함)
  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     // 조회수 증가 POST 요청 (PATCH 대신)
    //     await axios.post(
    //       `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/views`
    //     );
    //     // 게시글과 댓글 데이터 GET 요청 (응답은 { board: {...}, comments: [...] } 형태로 가정)
    //     const response = await axios.get(
    //       `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
    //     );
    //     setBoardItem(response.data.board);
    //     setComments(response.data.comments);
    //   } catch (error) {
    //     console.error("게시글 조회 실패:", error);
    //   }
    // ✅ 댓글 가져온 후, 필요한 userId 리스트 추출해서 userName 가져오기

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
        );

        console.log("📌 서버에서 받은 게시글 데이터:", response.data.board);
        console.log("📌 서버에서 받은 댓글 데이터:", response.data.comments);

        setBoardItem(response.data.board);
        setComments(response.data.comments); // ✅ 댓글 업데이트

        // ✅ 댓글을 가져온 후에 userId -> userName 조회 실행
        fetchUserNames(response.data.comments);
      } catch (error) {
        console.error("게시글 조회 실패:", error);
      }
    };

    fetchData();
  }, [type, boardId]); // ✅ boardId가 변경될 때마다 실행

  // 게시글 삭제 처리
  const onClickDelete = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
        );
        window.alert("삭제되었습니다.");
        nav(`/board/${type}`);
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        window.alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 수정 페이지로 이동 (상태로 게시글 데이터를 전달)
  const onClickEdit = () => {
    nav(`/board/${type}/boardeditor/${boardId}`, { state: { boardItem } });
  };
  // 취소 시 게시판 목록 페이지로 이동
  const onClickCancel = () => {
    nav(`/board/${type}`);
  };

  // 댓글 등록 처리 (이미지 없이 텍스트만)
  // const onAddComment = async () => {
  //   if (!newComment.trim()) {
  //     window.alert("댓글을 입력하세요.");
  //     return;
  //   }
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/comments`,
  //       {
  //         userId: myuserId, // 실제 사용자 ID로 대체 필요
  //         content: newComment,
  //       },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );
  //     console.log("댓글 등록 성공, 응답:", response.data);
  //     // 새 댓글 등록 후 전체 댓글 목록을 다시 불러옵니다.
  //     const refreshResponse = await axios.get(
  //       `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
  //     );
  //     setComments(refreshResponse.data.comments);

  //     // 등록 후 입력 필드 초기화
  //     setNewComment("");
  //   } catch (error) {
  //     console.error("댓글 추가 실패:", error);
  //     window.alert("댓글 추가 중 오류가 발생했습니다.");
  //   }
  // };
  const onAddComment = async () => {
    if (!newComment.trim()) {
      window.alert("댓글을 입력하세요.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/comments`,
        {
          userId: myuserId,
          userEmail: myuserEmail, // userEmail 추가
          content: newComment,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("댓글 등록 성공, 응답:", response.data);

      // 새 댓글 등록 후 전체 댓글 목록을 다시 불러옵니다.
      const refreshResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
      );
      setComments(refreshResponse.data.comments);

      // 등록 후 입력 필드 초기화
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      window.alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 처리
  const onSaveEditedComment = async (commentId) => {
    if (!editingCommentContent.trim()) {
      window.alert("수정할 내용을 입력하세요.");
      return;
    }
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/board/${type}/comments/${commentId}`,
        {
          writer: "현재사용자", // 필요 시 작성자 정보 포함
          content: editingCommentContent,
        }
      );
      // 댓글 목록 업데이트: 수정된 댓글 반영
      setComments(
        comments.map((c) => (c.commentId === commentId ? response.data : c))
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      window.alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제 처리
  const onDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/board/${type}/comments/${commentId}`
      );
      setComments((prevComments) =>
        prevComments.filter((c) => c.commentId !== commentId)
      );
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      window.alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!boardItem) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="freeview-freeBoardView">
      <header className="freeview-header">
        <div className="freeview-title">글 보기</div>
      </header>

      <div className="freeview-boardView">
        <div className="freeview-top-buttons">
          <button onClick={onClickEdit} className="freeview-editButton">
            수정
          </button>
          <button onClick={onClickDelete} className="freeview-deleteButton">
            삭제
          </button>
          <button onClick={onClickCancel} className="freeview-cancelButton">
            취소
          </button>
        </div>
        <div className="freeview-table">
          <table>
            <tbody>
              <tr height="60px">
                <td colSpan={2}>
                  <strong>{boardItem.title}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>{boardItem.content}</td>
              </tr>
              {/* 수정된 부분 시작 */}
              <tr height="80px">
                <td>이메일 : {boardItem.userEmail}</td>
                <td>작성일 : {getStringedDate(boardItem.boardRegdate)}</td>
                <td>조회수 : {boardItem.views}</td>
              </tr>
              {/* 수정된 부분 끝 */}
            </tbody>
          </table>
        </div>
      </div>

      <div className="freeview-comments">
        <h3>댓글달기</h3>
        {/* <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              {editingCommentId !== null &&
              editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="freeview-textarea"
                  />
                  <button
                    onClick={() => onSaveEditedComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentContent("");
                    }}
                    className="freeview-commentButton"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{comment.userEmail}:</strong> {comment.content}
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditingCommentContent(comment.content);
                    }}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul> */}
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="freeview-textarea"
                  />
                  <button
                    onClick={() => onSaveEditedComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentContent("");
                    }}
                    className="freeview-commentButton"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{userMap[comment.userId] || "알 수 없음"}:</strong>{" "}
                  {comment.content}
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditingCommentContent(comment.content);
                    }}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="freeview-commentInput">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="freeview-textarea"
          />
          <button onClick={onAddComment} className="freeview-commentButton">
            댓글 달기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardView;
