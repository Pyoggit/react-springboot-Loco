import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@/css/member/board/NoticeNew.css";

const NoticeNew = ({ curBoardItem, editOn }) => {
  const nav = useNavigate();

  // 🛠️ 목데이터 (기본 값 설정)
  const mockData = {
    title: "공지사항 제목 예시",
    content: "이곳에 공지사항 내용을 입력하세요.",
    writer: "작성자",
  };

  // 📌 입력 값 상태
  const [input, setInput] = useState({
    title: curBoardItem?.title || mockData.title,
    content: curBoardItem?.content || mockData.content,
    writer: curBoardItem?.writer || mockData.writer,
  });

  const [files, setFiles] = useState([]);

  // 📌 수정 모드일 경우 데이터 불러오기
  useEffect(() => {
    if (editOn && curBoardItem) {
      setInput({
        title: curBoardItem.title || mockData.title,
        content: curBoardItem.content || mockData.content,
        writer: curBoardItem.writer || mockData.writer,
      });
    }
  }, [editOn, curBoardItem]);

  // 📌 입력 값 변경 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  // 📌 파일 선택 핸들러
  const handleFileChange = (e) => {
    const fileArray = Array.from(e.target.files);
    setFiles(fileArray);
  };

  // 📌 게시글 등록 버튼 클릭 시
  const onClickSubmit = () => {
    console.log("Submitting Data:", { ...input, files });

    if (!input.title.trim() || !input.content.trim() || !input.writer.trim()) {
      alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    nav("/", { replace: true });
  };

  return (
    <div className="new-list-container">
      <header className="new-header">
        <div className="new-title">
          {editOn ? "글 수정하기" : "글 작성하기"}
        </div>
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
          <div className="new-file-upload">
            <input type="file" multiple onChange={handleFileChange} />
            <div className="new-image-preview">
              {files.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="new-preview-image"
                />
              ))}
            </div>
          </div>
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
              {editOn ? "수정 완료" : "등록하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeNew;
