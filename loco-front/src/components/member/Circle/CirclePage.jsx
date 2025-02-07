import React from 'react';
import { Route, Routes } from 'react-router';
import NewCircle from './NewCircle';
import CircleDetail from './CircleDetail';
import CircleMain from './CircleMain';

export default function CirclePage() {
  return (
    <Routes>
      <Route path="/main" element={<CircleMain />} />
      <Route path="/new" element={<NewCircle />} />
      <Route path="/detail/:id" element={<CircleDetail />} />
    </Routes>
  );
}
