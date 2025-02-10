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

const NoticeEditor = ({ title }) => {
  const { state } = useLocation(); // state에서 boardItem을 가져옵니다.
  const nav = useNavigate();

  // 현재 게시글 상태와 입력값을 위한 state
  const [curBoardItem, setCurBoardItem] = useState(
    state ? state.boardItem : null
  );
  const [input, setInput] = useState({
    title: "",
    content: "",
    writer: "",
  });

  // curBoardItem이 바뀔 때마다 폼을 갱신합니다.
  useEffect(() => {
    if (curBoardItem) {
      setInput({
        title: curBoardItem.title,
        content: curBoardItem.content,
        writer: curBoardItem.writer,
      });
    }
  }, [curBoardItem]);

  // 입력값 변경 처리
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  // 수정 버튼 클릭 시 처리
  const onClickSubmit = async () => {
    // 제목, 내용, 작성자가 비어있으면 경고
    if (!input.title || !input.content || !input.writer) {
      window.alert("모든 필드를 입력해주세요.");
      return;
    }

    console.log("수정된 게시글 내용:", input);

    try {
      // 실제 API 호출을 예시로 작성한 부분입니다.
      // const response = await fetch(`/api/board/${curBoardItem.id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(input),
      // });

      // if (response.ok) {
      //   console.log("게시글 수정 성공!");
      //   nav("/notice"); // 수정 후 목록 페이지로 이동
      // } else {
      //   console.error("수정 실패");
      // }

      console.log("게시글 수정 성공!");

      // 수정 후 목록 페이지로 리디렉션
      nav("/notice");
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 삭제 버튼 클릭 시 처리
  const onClickDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");

    if (confirmDelete) {
      console.log("삭제 요청:", curBoardItem);

      // 게시글 ID가 없으면 오류 처리
      if (!curBoardItem || !curBoardItem.id) {
        console.error("삭제할 게시글 ID가 없습니다.");
        return;
      }

      try {
        // 삭제 요청 (실제 API URL에 맞춰 수정 필요)
        const response = await fetch(`/api/board/${curBoardItem.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("게시글 삭제 성공!");
          nav("/notice"); // 삭제 후 목록 페이지로 이동
        } else {
          console.error("삭제 실패:", response.statusText);
        }
      } catch (error) {
        console.error("삭제 요청 실패:", error);
      }
    }
  };

  // 게시글 데이터가 없으면 로딩 중 표시
  if (!curBoardItem) {
    return <div>로딩 중...</div>;
  }

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
            onClick={() => nav(-1)} // 이전 페이지로 돌아가기
            style={{ backgroundColor: "#e0e0e0" }}
          />
          <Button
            text={"수정하기"}
            onClick={onClickSubmit} // 수정된 내용을 제출
          />
          <Button
            text={"삭제하기"}
            onClick={onClickDelete} // 게시글 삭제
          />
        </div>
      </div>
    </div>
  );
};

export default NoticeEditor;
