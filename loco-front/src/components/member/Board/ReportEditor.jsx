import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // Axios 사용
import "@/css/member/board/NoticeEditor.css";

// API 기본 경로 설정
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/board/freeboard`;

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
  const { state } = useLocation(); // state에서 boardItem을 가져옴
  const nav = useNavigate();

  const [curBoardItem, setCurBoardItem] = useState(state?.boardItem || null);
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

  // 게시글 수정 (PUT 요청)
  const onClickSubmit = async () => {
    if (!input.title.trim() || !input.content.trim() || !input.writer.trim()) {
      window.alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/view/${curBoardItem.id}`,
        {
          title: input.title,
          content: input.content,
          writer: input.writer,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      window.alert("게시글이 수정되었습니다.");
      nav("/board/report"); // 수정 후 목록으로 이동
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  // 게시글 삭제 (DELETE 요청)
  const onClickDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/view/${curBoardItem.id}`);
      window.alert("게시글이 삭제되었습니다.");
      nav("/board/report"); // 삭제 후 목록으로 이동
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
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
