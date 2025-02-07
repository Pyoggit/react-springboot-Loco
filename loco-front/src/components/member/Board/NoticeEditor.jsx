import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { BoardDispatchContext, BoardStateContext } from "../App";
import "@/css/member/board/NoticeEditor.css";
import Button from "./Button";

// 목업 데이터 추가
const mockData = [
  {
    id: 1,
    title: "공지사항 1",
    content: "내용 1",
    writer: "관리자",
    createdDate: "2025-02-05",
  },
  {
    id: 2,
    title: "공지사항 2",
    content: "내용 2",
    writer: "관리자",
    createdDate: "2025-02-04",
  },
];

const NoticeEditor = ({ title }) => {
  const [editOn, setEditOn] = useState(false);
  const { onUpdate } = useContext(BoardDispatchContext);
  const params = useParams();
  const nav = useNavigate();
  const contextData = useContext(BoardStateContext);
  const data = contextData && contextData.length > 0 ? contextData : mockData;
  const [curBoardItem, setCurBoardItem] = useState();
  const [input, setInput] = useState({ title: "", content: "", writer: "" });
  const [files, setFiles] = useState([]);

  useEffect(() => {
    console.log("BoardStateContext data:", data);
    console.log("params.id:", params.id);

    let currentBoardItem = data.find(
      (item) => String(item.id) === String(params.id)
    );

    if (!currentBoardItem) {
      console.warn("게시글을 찾을 수 없음, mockData 확인");
      currentBoardItem = mockData.find(
        (item) => String(item.id) === String(params.id)
      );
    }

    if (!currentBoardItem) {
      window.alert("존재하지 않는 글입니다.");
      nav("/", { replace: true });
    } else {
      setEditOn(true);
      setCurBoardItem(currentBoardItem);
      setInput({
        title: currentBoardItem.title,
        content: currentBoardItem.content,
        writer: currentBoardItem.writer,
        createdDate: currentBoardItem.createdDate,
      });
    }
  }, [params.id, data]);

  if (!curBoardItem) {
    return <div>데이터 로딩중...!</div>;
  }

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    setFiles(Array.from(fileList));
  };

  const onClickSubmit = () => {
    onUpdate(
      params.id,
      input.createdDate,
      input.title,
      input.content,
      input.writer
    );
    nav("/", { replace: true });
  };

  return (
    <div className="notice-editor">
      <header className="notice-header">
        <div>{title}</div>
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
        <div className="notice-file-upload">
          <input type="file" multiple onChange={handleFileChange} />
          <div className="notice-image-preview">
            {files.length > 0 &&
              files.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="notice-preview-image"
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
          <Button text={"취소하기"} onClick={() => nav(-1)} />
          <Button text={"등록하기"} onClick={onClickSubmit} />
        </div>
      </div>
    </div>
  );
};

export default NoticeEditor;
