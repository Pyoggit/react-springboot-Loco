import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "@/css/member/board/NoticeEditor.css";

// 버튼 컴포넌트
const Button = ({ text, onClick, style }) => {
  return (
    <button
      onClick={onClick}
      className="noticeview-custom-button"
      style={style}
    >
      {text}
    </button>
  );
};

const ReportEditor = () => {
  const { state } = useLocation(); // state에서 boardItem을 가져옵니다.
  const nav = useNavigate();

  const [curBoardItem, setCurBoardItem] = useState(
    state ? state.boardItem : null
  );
  const [input, setInput] = useState({
    title: "",
    content: "",
    writer: "",
  });

  useEffect(() => {
    if (curBoardItem) {
      setInput({
        title: curBoardItem.title,
        content: curBoardItem.content,
        writer: curBoardItem.writer,
      });
    }
  }, [curBoardItem]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const onClickSubmit = async () => {
    if (!input.title || !input.content || !input.writer) {
      window.alert("모든 필드를 입력해주세요.");
      return;
    }

    console.log("수정된 게시글 내용:", input);

    try {
      // 실제 API 호출을 예시로 작성한 부분입니다.
      console.log("게시글 수정 성공!");

      // 수정 후 목록 페이지로 리디렉션
      nav("/board/report");
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const onClickDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (confirmDelete) {
      console.log("삭제 요청:", curBoardItem);
      nav("/board/report");
    }
  };

  if (!curBoardItem) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="notice-editor">
      <header className="board-notice-editor-header">
        <div>글 수정하기</div>
      </header>
      <div className="notice-input">
        <input
          type="text"
          name="title"
          placeholder="제목"
          onChange={onChangeInput}
          value={input.title}
        />
        <input
          type="text"
          name="writer"
          placeholder="작성자"
          onChange={onChangeInput}
          value={input.writer}
        />
        <textarea
          name="content"
          placeholder="내용"
          rows={15}
          onChange={onChangeInput}
          value={input.content}
        />
        <div className="notice-button">
          <Button
            text={"취소하기"}
            onClick={() => nav(-1)}
            style={{ backgroundColor: "#e0e0e0" }}
          />
          <Button text={"수정하기"} onClick={onClickSubmit} />
          <Button text={"삭제하기"} onClick={onClickDelete} />
        </div>
      </div>
    </div>
  );
};

export default ReportEditor;
