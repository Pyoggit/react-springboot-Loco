import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/NoticeNew.css";

const FreeboardNew = () => {
  const nav = useNavigate();

  // 게시글 입력값 상태
  const [input, setInput] = useState({
    title: "",
    content: "",
    writer: "",
    image: "",
  });

  // 입력값 변경 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // 글 작성 시
  const onClickSubmit = () => {
    if (!input.title.trim() || !input.content.trim() || !input.writer.trim()) {
      alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    // 새 글 데이터 객체
    const newPost = {
      ...input,
      id: Date.now(), // 고유한 id 생성
      views: 0,
      createdDate: new Date().getTime(),
    };

    // 기존의 글 목록 불러오기 (없으면 빈 배열)
    const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // 새 글 추가
    existingPosts.push(newPost);

    // 글 목록을 localStorage에 저장
    localStorage.setItem("posts", JSON.stringify(existingPosts));

    // 글 작성 후 목록 페이지로 이동
    nav("/board/freeboard");
  };

  return (
    <div className="new-list-container">
      <header className="new-header">
        <div className="new-title">글 작성하기</div>
      </header>
      <div className="new-editor">
        <div className="new-input">
          <input
            type="text"
            name="title"
            placeholder="제목"
            onChange={onChangeInput}
            value={input.title}
            className="new-input-field"
          />
          <input
            type="text"
            name="writer"
            placeholder="작성자"
            onChange={onChangeInput}
            value={input.writer}
            className="new-input-field"
          />
          <input
            type="file"
            name="사진"
            onChange={onChangeInput}
            value={input.image}
            className="new-input-file"
          />
          <textarea
            name="content"
            placeholder="내용"
            rows={15}
            onChange={onChangeInput}
            value={input.content}
            className="new-textarea"
          />
          <div className="new-notice-button">
            <button onClick={() => nav(-1)} className="new-cancel-btn">
              취소하기
            </button>
            <button onClick={onClickSubmit} className="new-submit-btn">
              등록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeboardNew;
