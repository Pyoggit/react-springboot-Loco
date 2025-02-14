import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/NoticeNew.css";

const FreeboardNew = () => {
  const nav = useNavigate();

  // 게시글 입력값 상태 (텍스트 데이터)
  const [input, setInput] = useState({
    title: "",
    content: "",
    writer: "",
  });
  // 파일 상태 (사진)
  const [file, setFile] = useState(null);

  // 텍스트 입력값 변경 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 선택 핸들러 (value 속성 제거)
  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // 글 작성 시 API 호출
  const onClickSubmit = async () => {
    if (!input.title.trim() || !input.content.trim() || !input.writer.trim()) {
      alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    // FormData 생성: 텍스트 데이터는 JSON으로 Blob에 담아서 "board" 필드로 전송
    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(input)], { type: "application/json" })
    );
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/board/freeboard/freeboardnew`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("게시글 등록 성공:", response.data);
      nav("/board/freeboard");
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
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
            name="file"
            onChange={onFileChange}
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
