import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import CalendarNavigation from './CalendarNavigation';
import '@/css/member/circle/CalendarNavigation.css';
import '@/css/member/circle/CircleMain.css';
import CircleCategory from './CircleCategory';
import CircleList from './CircleList';
import NewCircle from './NewCircle';

const CircleMain = () => {
  const navigate = useNavigate();
  const nav = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [mockPosts, setMockPosts] = useState([
    {
      id: 1,
      createdDate: new Date('2025-02-05').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 2,
      createdDate: new Date('2025-02-06').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 3,
      createdDate: new Date('2025-02-06').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 4,
      createdDate: new Date('2025-02-07').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 5,
      createdDate: new Date('2025-02-08').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 6,
      createdDate: new Date('2025-02-10').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 7,
      createdDate: new Date('2025-02-13').getTime(),
      title: '축구 동아리 모임',
      time: '06:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 8,
      createdDate: new Date('2025-02-04').getTime(),
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
    },
    {
      id: 10,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
    },
    {
      id: 11,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
    },
    {
      id: 12,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
    },
    {
      id: 13,
      createdDate: new Date('2025-02-05').getTime(),
      title: '보컬 레슨 구합니다~[수원시 인계동]',
      time: '06:00',
      description: '이야야야야~~~~~~~!',
    },
  ]);

  const handleAddCircle = (newCircle) => {
    setMockPosts((prevPosts) => [...prevPosts, newCircle]);
    navigate('/');
  };

  const filteredPosts = mockPosts.filter(
    (post) =>
      new Date(post.createdDate).toDateString() === selectedDate.toDateString()
  );

  return (
    <>
      <CalendarNavigation
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />
      <div className="CircleList">
        <div className="menubar">
          <select>
            <option value={'latest'}>최신순</option>
            <option value={'oldest'}>오래된순</option>
          </select>
          <button
            className=".black-button"
            onClick={() => navigate('/circle/new')}
          >
            모임 만들기
          </button>
        </div>
      </div>
      <aside className="category-section">
        <CircleCategory />
      </aside>
      <main className="main-layout">
        <div className="content-section">
          <div className="mock-post-container">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-date">
                    📅{' '}
                    {new Date(post.createdDate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </p>
                  <p className="post-time">🕒 {post.time}</p>
                  <p className="post-description">{post.description}</p>
                </div>
              ))
            ) : (
              <p className="no-posts">해당 날짜에 모임이 없습니다.</p>
            )}
          </div>
        </div>
      </main>
      <Routes>
        <Route
          path="/circle/new"
          element={<NewCircle onAddCircle={handleAddCircle} />}
        />
      </Routes>
    </>
  );
};

export default CircleMain;
