import React, { useState, useEffect, useRef } from 'react';
import '@/css/member/circle/CalendarNavigation.css';
import '@/css/member/circle/CalendarButton.css';

const CalendarNavigation = ({ selectedDate, onDateChange }) => {
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
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + daysToMove);
        onDateChange(newDate);
        setIsAnimating(false);
      }, 300);
    }
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
              onClick={() => onDateChange(date)}
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
