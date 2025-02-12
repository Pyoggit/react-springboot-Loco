import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CalendarNavigation from './CalendarNavigation';
import '@/css/member/circle/CalendarNavigation.css';
import '@/css/member/circle/CircleMain.css';
import CircleListDetail from './CircleListDetail';
import NewCircle from './NewCircle';
import CircleDetail from './CircleDetail';
import CircleList from './CircleList';
import Category from '../Common/Category';

const CircleMain = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [circles, setCircles] = useState([]); // 백엔드에서 가져온 모임 데이터

  /** ✅ 1. 백엔드에서 모임 데이터 가져오기 */
  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const token = localStorage.getItem('token'); // ✅ 로컬 스토리지에서 JWT 토큰 가져오기
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/circles`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // ✅ JWT 토큰 추가
            },
          }
        );

        setCircles(response.data); // ✅ 백엔드에서 가져온 데이터 저장
      } catch (error) {
        console.error('모임 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCircles();
  }, []);

  /** ✅ 2. 새로운 모임 추가 시 기존 데이터와 합치기 */
  const handleAddCircle = (newCircle) => {
    setCircles((prevCircles) => [...prevCircles, newCircle]); // 기존 모임 목록에 새 모임 추가
    navigate('/'); // 모임 목록 페이지로 이동
  };

  /** ✅ 3. 모임 상세 페이지로 이동 */
  const handleNavigateToDetail = (post) => {
    localStorage.setItem('selectedPost', JSON.stringify(post));
    navigate(`/circle/detail/${post.id}`);
  };

  return (
    <>
      <CalendarNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <Category />
      <CircleList />

      {/* ✅ 백엔드에서 가져온 모임 데이터를 CircleListDetail에 전달 */}
      <CircleListDetail
        mockPosts={circles}
        selectedDate={selectedDate}
        onPostClick={handleNavigateToDetail}
      />

      <main className="main-layout">
        <Routes>
          <Route
            path="/circle/new"
            element={<NewCircle onAddCircle={handleAddCircle} />}
          />
          <Route path="/circle/detail/:id" element={<CircleDetail />} />
        </Routes>
      </main>
    </>
  );
};

export default CircleMain;
