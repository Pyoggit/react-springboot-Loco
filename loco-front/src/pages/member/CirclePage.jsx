import { Routes, Route } from "react-router-dom";
import CircleMain from "../../components/member/Circle/CircleMain";
import NewCircle from "../../components/member/Circle/NewCircle";

const CirclePage = () => {
  return (
    <Routes>
      <Route path="/" element={<CircleMain />} />
      <Route path="new" element={<NewCircle />} />
    </Routes>
  );
};

export default CirclePage;
