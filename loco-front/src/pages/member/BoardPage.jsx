import { Routes, Route } from "react-router-dom";
import Notice from "../../components/member/Board/Notice";
import Faq from "../../components/member/Board/Faq";
import Anonymous from "../../components/member/Board/Anonymous";
import Freeboard from "../../components/member/Board/Freeboard";
import Qna from "../../components/member/Board/Qna";
import Report from "../../components/member/Board/Report";
import Improvement from "../../components/member/Board/Improvement";

const BoardPage = () => {
  return (
    <Routes>
      <Route path="notice" element={<Notice />} />
      <Route path="faq" element={<Faq />} />
      <Route path="aanonymous" element={<Anonymous />} />
      <Route path="freeboard" element={<Freeboard />} />
      <Route path="qna" element={<Qna />} />
      <Route path="report" element={<Report />} />
      <Route path="improvement" element={<Improvement />} />
    </Routes>
  );
};

export default BoardPage;
