import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "@/css/member/board/FreeView.css";

const FreeView = () => {
  const [comments, setComments] = useState([
    { id: 1, writer: "user1", content: "이건 댓글입니다." },
    { id: 2, writer: "user2", content: "이건 또 다른 댓글입니다." },
  ]);

  const [newComment, setNewComment] = useState("");
  const params = useParams();
  const nav = useNavigate();

  // `getStringedDate` 자체 구현: 날짜를 "YYYY-MM-DD" 형식으로 반환
  const getStringedDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  const onClickDelete = () => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (confirmDelete) {
      // 삭제 기능을 구현하기 위한 코드 (여기서는 mock으로 처리)
      window.alert("삭제되었습니다.");
      nav("/board/freeboard"); // 자유게시판으로 리디렉션
    }
  };

  const onClickEdit = () => {
    // 수정 페이지로 이동 (글 수정 페이지 URL에 해당 글 ID를 포함)
    nav(`/board/freeboard/editor/${curBoardItem.id}`, {
      state: { boardItem: curBoardItem }, // 상태로 게시글 정보를 넘겨줌
    });
  };

  const onClickCancel = () => {
    // 취소 시, 자유게시판으로 돌아가기
    nav("/board/freeboard");
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
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="freeview-textarea"
          />
          <button onClick={() => {}} className="freeview-commentButton">
            댓글 달기
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeView;
