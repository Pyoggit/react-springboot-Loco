import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardDispatchContext } from "../App";
import "@/css/member/board/NoticeNew.css";

const NoticeNew = ({ curBoardItem, editOn }) => {
  const nav = useNavigate();
  const { onCreate } = useContext(BoardDispatchContext);
  const [input, setInput] = useState({
    title: "",
    content: "",
    writer: "",
  });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (editOn && curBoardItem) {
      setInput({
        title: curBoardItem.title,
        content: curBoardItem.content,
        writer: curBoardItem.writer,
        createdDate: curBoardItem.createdDate,
      });
    }
  }, [editOn, curBoardItem]);

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const fileArray = Array.from(e.target.files);
    setFiles(fileArray);
  };

  const onClickSubmit = () => {
    onCreate({
      ...input,
      files: files,
    });
    nav("/", { replace: true });
  };

  return (
    <div className="notice-new">
      <header className="header">
        <div className="title">글 작성하기</div>
      </header>
      <div className="editor">
        <div className="input">
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
          <div className="file-upload">
            <input type="file" multiple onChange={handleFileChange} />
            <div className="image-preview">
              {files.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="preview-image"
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
          />
          <div className="notice-button">
            <button onClick={() => nav(-1)}>취소하기</button>
            <button onClick={onClickSubmit}>등록하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeNew;
