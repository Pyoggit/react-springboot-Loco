import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@/css/member/board/NoticeboardView.css";

// 버튼 컴포넌트
const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="custom-button">
      {text}
    </button>
  );
};

// 헤더 컴포넌트
const Header = ({ title }) => {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
    </header>
  );
};

// 게시글 상세보기 컴포넌트
const NoticeboardView = () => {
  const params = useParams();
  const nav = useNavigate();

  const mockData = [
    {
      id: 1,
      title: "제목1",
      content: "내용1",
      writer: "김김김",
      createdDate: new Date("2025-01-01").getTime(),
    },
    {
      id: 2,
      title: "제목2",
      content: "내용2",
      writer: "박박박",
      createdDate: new Date("2025-01-09").getTime(),
    },
    {
      id: 3,
      title: "제목3",
      content: "내용3",
      writer: "이이이",
      createdDate: new Date("2025-01-13").getTime(),
    },
    {
      id: 4,
      title: "제목4",
      content: "내용4",
      writer: "홍홍홍",
      createdDate: new Date("2025-01-14").getTime(),
    },
    {
      id: 5,
      title: "제목5",
      content: "내용5",
      writer: "최최최",
      createdDate: new Date("2025-01-15").getTime(),
    },
  ];

  const [curBoardItem, setCurBoardItem] = useState(null);

  useEffect(() => {
    const currentBoardItem = mockData.find(
      (item) => String(item.id) === String(params.id)
    );

    if (!currentBoardItem) {
      window.alert("존재하지 않는 글입니다.");
      nav("/", { replace: true });
      return;
    }
    setCurBoardItem(currentBoardItem);
  }, [params.id, nav]);

  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      // 데이터 삭제 로직을 여기에 추가 (현재는 mockData라서 삭제를 구현하지 않음)
      nav("/", { replace: true });
    }
  };

  if (!curBoardItem) {
    return <div>데이터 로딩중...!</div>;
  }

  // 날짜 포맷: YYYY-MM-DD
  const formattedDate = new Date(curBoardItem.createdDate);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  const formattedCreatedDate = `${year}-${month}-${day}`;

  return (
    <div className="board">
      <Header title="글 보기" />
      <div className="boardView">
        <div className="notice-table">
          <table>
            <tbody>
              <tr height="60px">
                <td colSpan={2}>
                  <strong>{curBoardItem.title}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>{curBoardItem.content}</td>
              </tr>
              <tr height="80px">
                <td>작성자 : {curBoardItem.writer}</td>
                <td>작성일 : {formattedCreatedDate}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="notice-button">
          <Button
            text="글 수정하기"
            onClick={() => nav(`/edit/${curBoardItem.id}`)}
          />
          <Button text="글 삭제하기" onClick={onClickDelete} />
        </div>
      </div>
    </div>
  );
};

export default NoticeboardView;
