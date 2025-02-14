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
  const [circles, setCircles] = useState([]); // ✅ 백엔드에서 가져온 모임 데이터 저장

  /** ✅ 1. 선택한 날짜의 모임 데이터 가져오기 */
  useEffect(() => {
    const fetchCircles = async () => {
      try {
        const token = localStorage.getItem('token');
        const formattedDate = selectedDate.toISOString().split('T')[0];

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/circles?date=${formattedDate}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('📥 서버에서 받은 데이터:', response.data);
        setCircles(response.data);
      } catch (error) {
        console.error('❌ 모임 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCircles();
  }, [selectedDate]);

  /** ✅ 2. 새로운 모임 추가 시 기존 데이터와 합치기 */
  const handleAddCircle = (newCircle) => {
    setCircles((prevCircles) => [...prevCircles, newCircle]);
  };

  /** ✅ 3. 모임 상세 페이지로 이동 */
  const handleNavigateToDetail = (circle) => {
    const selectedCircle = {
      circleId: circle.circleId,
      circleName: circle.circleName,
      circleCategory: circle.circleCategory,
      circleDate: circle.circleDate,
      CircleDetail: circle.circleDetail,
      circleStatus: circle.circleStatus || '진행중', // 기본값 설정
      circleMaxMember: circle.circleMaxMember,
      circleMember: circle.circleMember,
      pictureUrl: circle.pictureUrl,
      circleAddress: circle.circleAddress,
      circleLat: circle.circleLat,
      circleLng: circle.circleLng,
    };

    localStorage.setItem('selectedPost', JSON.stringify(selectedCircle));
    navigate(`/circle/detail/${circle.circleId}`);
  };

  return (
    <>
      <CalendarNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <Category />
      <CircleList />

      {/* ✅ 선택한 날짜에 맞는 모임을 CircleListDetail에 전달 */}
      <CircleListDetail
        mockPosts={circles.length > 0 ? circles : []}
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
