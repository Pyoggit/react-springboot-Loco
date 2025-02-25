import { Routes, Route } from "react-router-dom";
import Container from "../../layouts/Container";
import Home from "./Home";
import CirclePage from "./CirclePage";
import ServicePage from "@/components/member/Common/ServicePage";
import BoardPage from "./BoardPage";
import MypageMain from "../../components/member/Mypage/MypageMain";
import SerchPage from "../../components/member/Common/SerchPage";
import MarketPage from "./MarketPage";
import ChatRoomPopup from "../../components/member/Common/ChatRoomPopup";
import GreetingPage from "../../components/member/Common/GreetingPage";
import UserGuidePage from "../../components/member/Common/UserGuidePage";
import { ChatProvider } from "@/utils/ChatContext";

//일반사용자 화면
const Member = () => {
  return (
    <ChatProvider>
      <Routes>
        <Route element={<Container />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatRoomPopup />} />
          <Route path="/chat/:roomId" element={<ChatRoomPopup />} />
          <Route path="/search" element={<SerchPage />} />
          <Route path="/circle" element={<CirclePage />} />
          <Route path="/board/*" element={<BoardPage />} />
          <Route path="/service/*" element={<ServicePage />} />
          <Route path="/mypage/*" element={<MypageMain />} />
          <Route path="/market/*" element={<MarketPage />} />
          <Route path="/circle/*" element={<CirclePage />} />
          <Route path="/greeting" element={<GreetingPage />} />
          <Route path="/user-guide" element={<UserGuidePage />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
};

export default Member;
