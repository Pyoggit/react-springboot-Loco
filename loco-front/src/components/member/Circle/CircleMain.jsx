import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CalendarNavigation from './CalendarNavigation';
import '@/css/member/circle/CalendarNavigation.css';
import '@/css/member/circle/CircleMain.css';
import CircleCategory from './CircleCategory';
import CircleListDetail from './CircleListDetail';
import NewCircle from './NewCircle';
import CircleDetail from './CircleDetail';
import CircleList from './CircleList';
import Category from '../Common/Category';

const CircleMain = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [mockPosts, setMockPosts] = useState([
    {
      id: 1,
      createdDate: new Date('2025-02-07').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 2,
      createdDate: new Date('2025-02-06').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 3,
      createdDate: new Date('2025-02-07').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 4,
      createdDate: new Date('2025-02-07').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 5,
      createdDate: new Date('2025-02-08').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 6,
      createdDate: new Date('2025-02-10').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 7,
      createdDate: new Date('2025-02-13').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
      image: '사진1',
    },
    {
      id: 8,
      createdDate: new Date('2025-02-04').getTime(),
      image: '사진1',
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 9,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
      image: '사진1',
    },
    {
      id: 10,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
      image: '사진1',
    },
    {
      id: 11,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
      image: '사진1',
    },
    {
      id: 12,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
      image: '사진1',
    },
    {
      id: 13,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
      image: '사진1',
    },
  ]);

  const handleAddCircle = (newCircle) => {
    setMockPosts((prevPosts) => [...prevPosts, newCircle]);
    navigate('/');
  };

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
      {/* ✅ 항상 렌더링되도록 Routes 바깥으로 이동 */}
      <CircleListDetail
        mockPosts={mockPosts}
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
