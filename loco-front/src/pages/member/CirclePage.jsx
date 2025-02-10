import { Routes, Route } from 'react-router-dom';
import CircleMain from '../../components/member/Circle/CircleMain';
import NewCircle from '../../components/member/Circle/NewCircle';
import CircleDetail from '../../components/member/Circle/CircleDetail';
import SearchMap from '../../components/member/Circle/SearchMap';

const CirclePage = () => {
  return (
    <Routes>
      <Route path="/" element={<CircleMain />} />
      <Route path="new" element={<NewCircle />} />
      <Route path="detail/:id" element={<CircleDetail />} />
    </Routes>
  );
};

export default CirclePage;
