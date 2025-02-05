import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BoardStateContext, BoardDispatchContext } from "../App";
import { getStringedDate } from "../util/get-stringed-date";
import "@/css/member/board/BoardView.css";

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
  const data = useContext(BoardStateContext);
  const { onDelete } = useContext(BoardDispatchContext);

  const [curBoardItem, setCurBoardItem] = useState(null);

  useEffect(() => {
    const currentBoardItem = data.find(
      (item) => String(item.id) === String(params.id)
    );

    if (!currentBoardItem) {
      window.alert("존재하지 않는 글입니다.");
      nav("/", { replace: true });
      return;
    }
    setCurBoardItem(currentBoardItem);
  }, [params.id, data, nav]);

  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      onDelete(params.id);
      nav("/", { replace: true });
    }
  };

  if (!curBoardItem) {
    return <div>데이터 로딩중...!</div>;
  }

  return (
    <div className="board">
      <Header title="글 보기" />
      <div className="boardView">
        <div className="table">
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
              {curBoardItem.image && (
                <tr>
                  <td colSpan={2}>
                    <img
                      src={curBoardItem.image}
                      alt="Uploaded"
                      style={{
                        width: "100%",
                        height: "auto",
                        marginTop: "20px",
                      }}
                    />
                  </td>
                </tr>
              )}
              <tr height="80px">
                <td>작성자 : {curBoardItem.writer}</td>
                <td>
                  작성일 : {getStringedDate(new Date(curBoardItem.createdDate))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button">
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
