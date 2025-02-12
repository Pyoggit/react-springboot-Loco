import { Routes, Route } from "react-router-dom";
import Container from "../../layouts/Container";
import Home from "./Home";
import CirclePage from "./CirclePage";
import ServicePage from "./ServicePage";
import BoardPage from "./BoardPage";
import MypageMain from "../../components/member/Mypage/MypageMain";
import SerchPage from "./SerchPage";
import MarketPage from "./MarketPage";
import ChatRoom from "../../components/member/Common/ChatRoom";

//일반사용자 화면
const Member = () => {
  return (
    <>
      <Routes>
        <Route element={<Container />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/search" element={<SerchPage />} />
          <Route path="/circle" element={<CirclePage />} />
          <Route path="/board/*" element={<BoardPage />} />
          <Route path="/service" element={<ServicePage />} />
          <Route path="/mypage/*" element={<MypageMain />} />
          <Route path="/market/*" element={<MarketPage />} />
          <Route path="/circle/*" element={<CirclePage />} />
        </Route>
      </Routes>
    </>
  );
};

export default Member;
