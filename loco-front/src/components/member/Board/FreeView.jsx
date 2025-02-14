import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/FreeView.css";

const FreeView = () => {
  const [boardItem, setBoardItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newCommentImage, setNewCommentImage] = useState(null); // 댓글 이미지 상태
  const { boardId } = useParams();
  const nav = useNavigate();

  // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const getStringedDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  // 게시글 및 댓글 데이터 백엔드 API에서 받아오기
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/board/freeboard/${boardId}`)
      .then((response) => {
        // 백엔드 API는 { board: {...}, comments: [...] } 형태로 응답한다고 가정합니다.
        setBoardItem(response.data.board);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.error("게시글 조회 실패:", error);
      });
  }, [boardId]);

  // 게시글 삭제 처리
  const onClickDelete = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/board/freeboard/${boardId}`
        );
        window.alert("삭제되었습니다.");
        nav("/board/freeboard");
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        window.alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 수정 페이지로 이동 (상태로 게시글 데이터를 전달)
  const onClickEdit = () => {
    nav(`/board/freeboard/editor/${boardId}`, { state: { boardItem } });
  };

  // 취소 시 자유게시판 목록 페이지로 이동
  const onClickCancel = () => {
    nav("/board/freeboard");
  };

  // 댓글 추가 처리
  const onAddComment = async () => {
    if (!newComment.trim()) {
      window.alert("댓글을 입력하세요.");
      return;
    }
    try {
      let response;
      // 파일이 선택된 경우 FormData로 전송
      if (newCommentImage) {
        const formData = new FormData();
        formData.append("writer", "현재사용자"); // 실제 사용자 정보로 대체 필요
        formData.append("content", newComment);
        formData.append("image", newCommentImage);
        response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/board/freeboard/${boardId}/comments`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // 파일 없이 일반 JSON 데이터로 전송
        response = await axios.post(
          `${
            import.meta.env.VITE_API_URL
          }/api/board/freeboard/${boardId}/comments`,
          {
            writer: "현재사용자", // 실제 사용자 정보로 대체 필요
            content: newComment,
          }
        );
      }
      // 응답으로 새 댓글 데이터를 받고, 댓글 목록에 추가
      setComments([...comments, response.data]);
      setNewComment("");
      setNewCommentImage(null); // 업로드 후 파일 상태 초기화
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      window.alert("댓글 추가 중 오류가 발생했습니다.");
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
              {boardItem.image && (
                <tr>
                  <td colSpan={2}>
                    <img
                      src={boardItem.image}
                      alt="Uploaded"
                      className="freeview-image"
                    />
                  </td>
                </tr>
              )}
              <tr height="80px">
                <td>작성자 : {boardItem.writer}</td>
                <td>작성일 : {getStringedDate(boardItem.boardRegdate)}</td>
              </tr>
              <tr>
                <td colSpan={2}>조회수 : {boardItem.views}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="freeview-comments">
        <h3>댓글달기</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              <div>
                <strong>{comment.writer}:</strong> {comment.content}
              </div>
              {/* 댓글에 이미지가 있을 경우 출력 */}
              {comment.image && (
                <div>
                  <img
                    src={comment.image}
                    alt="댓글 첨부 이미지"
                    className="freeview-commentImage"
                  />
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
          {/* 파일 선택 input 추가 */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setNewCommentImage(e.target.files[0]);
              }
            }}
            className="freeview-fileInput"
          />
          <button onClick={onAddComment} className="freeview-commentButton">
            댓글 달기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeView;
