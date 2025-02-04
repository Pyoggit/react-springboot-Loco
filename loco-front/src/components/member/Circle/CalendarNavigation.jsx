import React, { useState, useEffect, useRef } from 'react';
import './css/CalendarNavigation.css'; // 스타일 파일 연결
import './css/CalendarButton.css';

const CalendarNavigation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesInView, setDatesInView] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    generateWeekDates(selectedDate);
  }, [selectedDate]);

  const generateWeekDates = (date) => {
    const currentDates = Array.from({ length: 7 }, (_, i) => {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 3 + i);
      return newDate;
    });
    setDatesInView(currentDates);
  };

  const handleDateTransition = (daysToMove) => {
    if (!isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setSelectedDate(
          (prevDate) =>
            new Date(prevDate.setDate(prevDate.getDate() + daysToMove))
        );
        setIsAnimating(false);
      }, 300); // 300ms transition delay
    }
  };

  // 드래그/스와이프 이벤트 처리
  const startXRef = useRef(null);

  const handleDragStart = (e) => {
    startXRef.current =
      e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
  };

  const handleDragEnd = (e) => {
    if (!startXRef.current) return;
    const endX =
      e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
    const distance = startXRef.current - endX;

    if (Math.abs(distance) > 50) {
      handleDateTransition(distance > 0 ? 1 : -1);
    }
    startXRef.current = null;
  };

  return (
    <div className="calendar-container">
      <button
        className="calendar-nav-button"
        onClick={() => handleDateTransition(-1)}
      >
        {'<'}
      </button>

      <div
        ref={listRef}
        className={`dates-list ${isAnimating ? 'animating' : ''}`}
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {datesInView.map((date, index) => {
          const dayOfWeek = date.getDay();
          let dateClass = 'date-item';

          if (dayOfWeek === 0) dateClass += ' sunday';
          if (dayOfWeek === 6) dateClass += ' saturday';
          if (date.toDateString() === selectedDate.toDateString())
            dateClass += ' selected';
          if (date.toDateString() === new Date().toDateString())
            dateClass += ' today';

          return (
            <div
              key={index}
              className={dateClass}
              onClick={() => setSelectedDate(date)}
            >
              <div>{date.getDate()}일</div>
              <div className="day-text">
                {['일', '월', '화', '수', '목', '금', '토'][dayOfWeek]}
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="calendar-nav-button"
        onClick={() => handleDateTransition(1)}
      >
        {'>'}
      </button>
    </div>
  );
};

export default CalendarNavigation;
