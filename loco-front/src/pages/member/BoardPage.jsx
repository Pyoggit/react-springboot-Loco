import { Routes, Route } from "react-router-dom";
import Notice from "../../components/member/Board/Notice";
import Faq from "../../components/member/Board/Faq";
import Freeboard from "../../components/member/Board/Freeboard";
import Qna from "../../components/member/Board/Qna";
import Report from "../../components/member/Board/Report";
import Improvement from "../../components/member/Board/Improvement";
import NoticeboardView from "../../components/member/Board/NoticeboardView";
import FreeView from "../../components/member/Board/FreeView";
import NoticeEditor from "../../components/member/Board/NoticeEditor";
import FreeboardEditor from "../../components/member/Board/FreeboardEditor";
import ReportEditor from "../../components/member/Board/ReportEditor";
import ReportView from "../../components/member/Board/ReportView";
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
      {/* <Route path="improvement" element={<Improvement />} /> */}

      {/* 글 작성 */}
      <Route path="/new" element={<BoardNew />} />

      {/* <Route path="notice/view/:id" element={<NoticeboardView />} /> */}
      {/* <Route path="qna/view/:id" element={<QnaView />} /> */}
      {/* <Route path="freeboard/view/:id" element={<FreeView />} /> */}
      {/* <Route path="improvement/view/:id" element={<ImprovementView />} /> */}
      {/* <Route path="report/view/:id" element={<ReportView />} /> */}

      {/* ✅ 6개 게시판을 하나의 공통 BoardView로 처리 */}
      <Route path=":type/:boardId" element={<BoardView />} />

      {/* 게시글 수정: /board/:type/editor/:boardId */}
      <Route path=":type/editor/:boardId" element={<BoardEditor />} />

      {/* <Route path="faq/view/:id" element={<FaqView />} /> */}

      {/* <Route path="notice/editor/:id" element={<NoticeEditor />} /> */}
      {/* <Route path="freeboard/editor/:id" element={<FreeboardEditor />} /> */}
      {/* <Route path="improvement/editor/:id" element={<ImprovementEditor />} /> */}
      {/* <Route path="report/editor/:id" element={<ReportEditor />} /> */}
      {/* <Route path="qna/editor/:id" element={<QnaEditor />} /> */}
      {/* <Route path="faq/editor/:id" element={<FaqEditor />} /> */}
    </Routes>
  );
};

export default BoardPage;
