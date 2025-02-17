import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/NoticeEditor.css";

const BoardEditor = () => {
  const { type, boardId } = useParams();
  const { state } = useLocation(); // 이전 페이지에서 전달한 boardItem
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    writer: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 기존 boardItem이 없으면 백엔드에서 데이터 fetch
  useEffect(() => {
    if (state && state.boardItem) {
      setFormData({
        title: state.boardItem.title,
        content: state.boardItem.content,
        writer: state.boardItem.writer,
      });
      setLoading(false);
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`)
        .then((response) => {
          // response.data가 { board: {...}, comments: [...] } 형태라면:
          const board = response.data.board;
          setFormData({
            title: board.title,
            content: board.content,
            writer: board.writer,
          });
        })
        .catch((error) => {
          console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
          alert("게시글 데이터를 불러오는데 실패했습니다.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [state, type, boardId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onClickSubmit = async () => {
    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.writer.trim()
    ) {
      alert("제목, 내용, 작성자를 모두 입력해주세요.");
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append("title", formData.title);
      updateData.append("content", formData.content);
      updateData.append("writer", formData.writer);
      if (selectedFile) {
        updateData.append("image", selectedFile);
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`,
        updateData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("게시글이 수정되었습니다.");
      navigate(`/board/${type}`);
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const onClickDelete = async () => {
    if (!window.confirm("정말로 이 글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
      );
      alert("게시글이 삭제되었습니다.");
      navigate(`/board/${type}`);
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>데이터 로딩중...</div>;
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
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          name="writer"
          placeholder="작성자"
          value={formData.writer}
          onChange={handleChange}
        />
        <textarea
          name="content"
          placeholder="내용"
          rows={15}
          value={formData.content}
          onChange={handleChange}
        />
        {/* 파일 수정 입력 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        <div className="notice-button">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="noticeview-custom-button"
            style={{ backgroundColor: "#e0e0e0" }}
          >
            취소하기
          </button>
          <button
            type="button"
            onClick={onClickSubmit}
            className="noticeview-custom-button"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={onClickDelete}
            className="noticeview-custom-button"
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardEditor;
