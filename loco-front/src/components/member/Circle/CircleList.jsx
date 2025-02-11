import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/circle/CircleList.css';
const CircleList = () => {
  const nav = useNavigate();

  //props로 넘어온 데이터를 정렬한다.

  //정렬된 데이터

  return (
    <div className="CircleList">
      <div className="menubar">
        <select>
          <option value={'latest'}>최신순</option>
          <option value={'oldest'}>오래된순</option>
        </select>
        <button
          className="new-button"
          onClick={() => {
            nav(`/circle/new`);
          }}
        >
          모임 만들기
        </button>
      </div>
    </div>
  );
};
export default CircleList;
