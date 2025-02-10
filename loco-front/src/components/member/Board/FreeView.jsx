import React, { useState } from "react";
import "@/css/member/board/FreeView.css";
import { useNavigate, useParams } from "react-router-dom";

const FreeView = () => {
  const [comments, setComments] = useState([
    { id: 1, writer: "user1", content: "이건 댓글입니다." },
    { id: 2, writer: "user2", content: "이건 또 다른 댓글입니다." },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentData = {
        id: comments.length + 1,
        writer: "currentUser", // 현재 사용자 이름으로 바꿔주세요.
        content: newComment,
      };
      setComments([...comments, newCommentData]);
      setNewComment("");
    }
  };

  const params = useParams();
  const nav = useNavigate();

  // `getStringedDate` 자체 구현: 날짜를 "YYYY-MM-DD" 형식으로 반환
  const getStringedDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  // 게시글 삭제 기능 자체 구현
  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // 실제 삭제 작업은 여기서 처리되도록 하며, 예를 들어 상태나 API 호출 등을 사용할 수 있습니다.
      console.log(`게시글 ${params.id} 삭제`);
      nav("/", { replace: true });
    }
  };

  const curBoardItem = {
    id: 1,
    title: "예시 게시글 제목",
    content: "이것은 게시글의 내용입니다.",
    writer: "작성자 이름",
    createdDate: new Date().toISOString(),
    image: "https://via.placeholder.com/150",
  };

  return (
    <div className="freeview-freeBoardView">
      <header className="freeview-header">
        <div className="freeview-title">글 보기</div>
      </header>

      <div className="freeview-boardView">
        <div className="freeview-top-buttons">
          <button
            onClick={() => nav(`/edit/${curBoardItem.id}`)}
            className="freeview-editButton"
          >
            수정
          </button>
          <button onClick={onClickDelete} className="freeview-deleteButton">
            삭제
          </button>
        </div>
        <div className="freeview-table">
          <table>
            <tr height="60px">
              <td colSpan={2}>
                <strong>{curBoardItem.title}</strong>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>{curBoardItem.content}</td>
            </tr>
            {curBoardItem.image && (
              <tr>
                <td colSpan={2}>
                  <img
                    src={curBoardItem.image}
                    alt="Uploaded"
                    className="freeview-image"
                  />
                </td>
              </tr>
            )}
            <tr height="80px">
              <td>작성자 : {curBoardItem.writer}</td>
              <td>
                작성일 : {getStringedDate(new Date(curBoardItem.createdDate))}
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div className="freeview-comments">
        <h3>댓글달기</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.writer}:</strong> {comment.content}
            </li>
          ))}
        </ul>
        <div className="freeview-commentInput">
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요..."
            className="freeview-textarea"
          />
          <button onClick={handleAddComment} className="freeview-commentButton">
            댓글 달기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeView;
