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
  const [selectedCategory, setSelectedCategory] = useState('전체'); // ✅ 선택한 카테고리 상태 추가

  /** ✅ 1. 선택한 날짜와 카테고리의 모임 데이터 가져오기 */
  const fetchCircles = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const categoryQuery =
        selectedCategory === '전체' ? '' : `&category=${selectedCategory}`;

      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/circles?date=${formattedDate}${categoryQuery}`,
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

  // ✅ 선택한 날짜와 카테고리가 변경되면 모임 데이터를 불러옴
  useEffect(() => {
    fetchCircles();
  }, [selectedDate, selectedCategory]);

  /** ✅ 2. 새로운 모임 추가 시 기존 데이터와 합치기 */
  const handleAddCircle = (newCircle) => {
    setCircles((prevCircles) => [newCircle, ...prevCircles]); // ✅ 새 모임을 앞에 추가
    fetchCircles(); // ✅ 백엔드 데이터도 다시 가져오기
  };

  /** ✅ 3. 모임 상세 페이지로 이동 */
  const handleNavigateToDetail = (circle) => {
    const selectedCircle = {
      circleId: circle.circleId,
      circleName: circle.circleName,
      circleCategory: circle.circleCategory,
      circleDate: circle.circleDate,
      circleDetail: circle.circleDetail,
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
      <Category
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CircleList />

      {/* ✅ 선택한 날짜와 카테고리에 맞는 모임을 CircleListDetail에 전달 */}
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
