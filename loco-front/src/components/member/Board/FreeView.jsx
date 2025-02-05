import React, { useState, useContext } from "react";
import "@/css/member/board/FreeView.css";
import Button from "./Button";
import { getStringedDate } from "../util/get-stringed-date";
import { useNavigate, useParams } from "react-router-dom";
import { BoardDispatchContext } from "../App";

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
  const { onDelete } = useContext(BoardDispatchContext);

  const curBoardItem = {
    id: 1,
    title: "예시 게시글 제목",
    content: "이것은 게시글의 내용입니다.",
    writer: "작성자 이름",
    createdDate: new Date().toISOString(),
    image: "https://via.placeholder.com/150",
  };

  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete(params.id);
      nav("/", { replace: true });
    }
  };

  return (
    <div className="freeBoardView">
      <header className="header">
        <div className="title">글 보기</div>
      </header>

      <div className="boardView">
        <div
          className="top-buttons"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            text="수정"
            onClick={() => nav(`/edit/${curBoardItem.id}`)}
            small
          />
          <Button text="삭제" onClick={onClickDelete} small />
        </div>
        <div className="table">
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
                    style={{ width: "100%", height: "auto", marginTop: "20px" }}
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

      <div className="comments">
        <h3>댓글달기</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.writer}:</strong> {comment.content}
            </li>
          ))}
        </ul>
        <div
          className="commentInput"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <textarea
            value={newComment}
            onChange={handleCommentChange}
            placeholder="댓글을 입력하세요..."
            style={{ flex: 1, marginRight: "10px" }}
          />
          <Button text="댓글 달기" onClick={handleAddComment} />
        </div>
      </div>
    </div>
  );
};

export default FreeView;
