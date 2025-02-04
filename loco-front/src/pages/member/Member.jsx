import { Routes, Route } from "react-router-dom";
import Container from "../../layouts/Container";
import Home from "./Home";
import MarketPage from "./MarketPage";
import CircleMain from "../../components/member/Circle/CircleMain";
import ServicePage from "./ServicePage";
import BoardPage from "./BoardPage";
import MypageMain from "../../components/member/Mypage/MypageMain";
import SerchPage from "./SerchPage";

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
        </Route>
      </Routes>
    </>
  );
};

export default Member;
