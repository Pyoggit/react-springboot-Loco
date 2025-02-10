import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@/css/member/board/NoticeboardView.css";

// 버튼 컴포넌트
const Button = ({ text, onClick }) => {
  return (
    <button onClick={onClick} className="noticeview-custom-button">
      {text}
    </button>
  );
};

// 헤더 컴포넌트
const Header = ({ title }) => {
  return (
    <header className="noticeview-header">
      <h1 className="noticeview-header-title">{title}</h1>
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

  // 삭제 버튼 클릭 시 동작
  const onClickDelete = () => {
    const confirmDelete = window.confirm("정말로 이 글을 삭제하시겠습니까?");
    if (confirmDelete) {
      // 실제 삭제 기능을 구현 (여기서는 mock으로 처리)
      window.alert("삭제되었습니다.");
      nav("/"); // 삭제 후 홈으로 리디렉션
    }
  };

  // 수정 버튼 클릭 시 동작
  const onClickEdit = () => {
    // 수정 페이지로 이동 (글 수정 페이지 URL에 해당 글 ID를 포함)
    nav(`/board/notice/editor/${curBoardItem.id}`, {
      state: { boardItem: curBoardItem }, // 상태로 게시글 정보를 넘겨줌
    });
  };

  // 취소 버튼 클릭 시 동작 (이전 페이지로 돌아가기)
  const onClickCancel = () => {
    nav(-1); // 이전 페이지로 돌아가기
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
    <div className="noticeview-board">
      <Header title="글 보기" />
      <div className="noticeview-boardView">
        <div className="noticeview-table">
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
        <div className="noticeview-button-container">
          <Button text="글 수정하기" onClick={onClickEdit} />
          <Button text="글 삭제하기" onClick={onClickDelete} />
          <Button text="취소하기" onClick={onClickCancel} />
        </div>
      </div>
    </div>
  );
};

export default NoticeboardView;
