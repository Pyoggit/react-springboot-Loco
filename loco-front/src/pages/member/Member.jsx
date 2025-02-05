import { Routes, Route } from "react-router-dom";
import Container from "../../layouts/Container";
import Home from "./Home";
import MarketPage from "./MarketPage";
import CircleMain from "../../components/member/Circle/CircleMain";
import ServicePage from "./ServicePage";
import BoardPage from "./BoardPage";
import MypageMain from "../../components/member/Mypage/MypageMain";
import SerchPage from "./SerchPage";
import Notice from "../../components/member/Board/Notice";
import Faq from "../../components/member/Board/Faq";
import Anonymous from "../../components/member/Board/Anonymous";
import Freeboard from "../../components/member/Board/Freeboard";
import Qna from "../../components/member/Board/Qna";
import Report from "../../components/member/Board/Report";
import Improvement from "../../components/member/Board/Improvement";

//일반사용자 화면
const Member = () => {
  return (
    <>
      <Routes>
        <Route element={<Container />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/search" element={<SerchPage />} />
          <Route path="/circle" element={<CircleMain />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/mypage/*" element={<MypageMain />} />
          <Route path="/board/notice" element={<Notice />} />
          <Route path="/board/faq" element={<Faq />} />
          <Route path="/board/aanonymous" element={<Anonymous />} />
          <Route path="/board/freeboard" element={<Freeboard />} />
          <Route path="/board/qna" element={<Qna />} />
          <Route path="/board/report" element={<Report />} />
          <Route path="/board/improvement" element={<Improvement />} />
        </Route>
      </Routes>
    </>
  );
};

export default Member;
