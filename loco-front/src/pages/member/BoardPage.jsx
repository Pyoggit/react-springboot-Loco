import { Routes, Route } from "react-router-dom";
import Notice from "../../components/member/Board/Notice";
import Faq from "../../components/member/Board/Faq";
import Freeboard from "../../components/member/Board/Freeboard";
import Qna from "../../components/member/Board/Qna";
import Report from "../../components/member/Board/Report";
import Improvement from "../../components/member/Board/Improvement";
import NoticeNew from "../../components/member/Board/NoticeNew";
import QnaNew from "../../components/member/Board/QnaNew";
import NoticeboardView from "../../components/member/Board/NoticeboardView";
import FreeView from "../../components/member/Board/FreeView";
import NoticeEditor from "../../components/member/Board/NoticeEditor";
import FreeboardEditor from "../../components/member/Board/FreeboardEditor";
import ImprovementNew from "../../components/member/Board/ImprovementNew";
import ReportEditor from "../../components/member/Board/ReportEditor";
import ReportNew from "../../components/member/Board/ReportNew";
import FaqNew from "../../components/member/Board/FaqNew";
import ReportView from "../../components/member/Board/ReportView";

const BoardPage = () => {
  return (
    <Routes>
      <Route path="notice" element={<Notice />} />
      <Route path="faq" element={<Faq />} />
      <Route path="freeboard" element={<Freeboard />} />
      <Route path="qna" element={<Qna />} />
      <Route path="report" element={<Report />} />
      <Route path="improvement" element={<Improvement />} />

      <Route path="notice/new" element={<NoticeNew />} />
      <Route path="qna/qnanew" element={<QnaNew />} />
      <Route path="improvement/improvementnew" element={<ImprovementNew />} />
      <Route path="report/reportnew" element={<ReportNew />} />
      <Route path="faq/faqnew" element={<FaqNew />} />

      <Route path="notice/noticeboardview/:id" element={<NoticeboardView />} />
      <Route path="freeboard/freeview/:id" element={<FreeView />} />
      <Route path="report/reportview/:id" element={<ReportView />} />

      <Route path="notice/editor/:id" element={<NoticeEditor />} />
      <Route path="freeboard/editor/:id" element={<FreeboardEditor />} />
      <Route path="improvement/editor/:id" element={<NoticeEditor />} />
      <Route path="report/editor/:id" element={<ReportEditor />} />
      {/* <Route path="qna/editor/:id" element={<NoticeEditor />} />
      <Route path="faq/editor/:id" element={<NoticeEditor />} /> */}
    </Routes>
  );
};

export default BoardPage;
