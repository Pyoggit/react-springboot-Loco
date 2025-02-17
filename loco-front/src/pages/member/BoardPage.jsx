import { Routes, Route } from "react-router-dom";
import Notice from "../../components/member/Board/Notice";
import Faq from "../../components/member/Board/Faq";
import Freeboard from "../../components/member/Board/Freeboard";
import Qna from "../../components/member/Board/Qna";
import Report from "../../components/member/Board/Report";
import Improvement from "../../components/member/Board/Improvement";
import BoardNew from "../../components/member/Board/BoardNew";
import BoardView from "../../components/member/Board/BoardView";
import BoardEditor from "../../components/member/Board/BoardEditor";

const BoardPage = () => {
  return (
    <Routes>
      <Route path="notice" element={<Notice />} />
      <Route path="faq" element={<Faq />} />
      <Route path="freeboard" element={<Freeboard />} />
      <Route path="qna" element={<Qna />} />
      <Route path="report" element={<Report />} />
      <Route path="improvement" element={<Improvement />} />

      {/* 글 작성 */}
      <Route path="/new" element={<BoardNew />} />

      {/* ✅ 6개 게시판을 하나의 공통 BoardView로 처리 */}
      <Route path=":type/:boardId" element={<BoardView />} />

      {/* 게시글 수정: /board/:type/editor/:boardId */}
      <Route path=":type/boardeditor/:boardId" element={<BoardEditor />} />
    </Routes>
  );
};

export default BoardPage;
