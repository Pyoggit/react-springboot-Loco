import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/QnaNew.css";

const QnaNew = ({ curBoardItem, editOn }) => {
  const nav = useNavigate();

  // 🛠️ 목데이터 (기본 값 설정)
  const mockData = {
    title: "질문 제목 예시",
    content: "이곳에 공지사항 내용을 입력하세요.",
  };

  // 📌 입력 값 상태
  const [input, setInput] = useState({
    title: curBoardItem?.title || mockData.title,
    content: curBoardItem?.content || mockData.content,
  });

  const [files, setFiles] = useState([]);

  // 📌 수정 모드일 경우 데이터 불러오기
  useEffect(() => {
    if (editOn && curBoardItem) {
      setInput({
        title: curBoardItem.title || mockData.title,
        content: curBoardItem.content || mockData.content,
      });
    }
  }, [editOn, curBoardItem]);

  // 📌 입력 값 변경 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 게시글 등록 버튼 클릭 시
  const onClickSubmit = () => {
    console.log("Submitting Data:", { ...input, files });

    if (!input.title.trim() || !input.content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    nav("/", { replace: true });
  };

  return (
    <div className="qnanew-list-container">
      <header className="qnanew-header">
        <div className="qnanew-title">
          {editOn ? "질문 수정하기" : "글 작성하기"}
        </div>
      </header>
      <div className="qnanew-editor">
        <div className="qnanew-input">
          <input
            type="text"
            name="title"
            placeholder="제목"
            onChange={onChangeInput}
            value={input.title}
            className="qnanew-input-field"
          />
          <textarea
            name="content"
            placeholder="내용"
            rows={15}
            onChange={onChangeInput}
            value={input.content}
            className="qnanew-textarea"
          />
          <div className="qnanew-notice-button">
            <button onClick={() => nav(-1)} className="qnanew-cancel-btn">
              취소하기
            </button>
            <button onClick={onClickSubmit} className="qnanew-submit-btn">
              {editOn ? "수정 완료" : "등록하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnaNew;
