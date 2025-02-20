import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '@/css/member/Circle/MypageCircle.css';

const MypageCircle = () => {
  const [userCircles, setUserCircles] = useState([]);

  const fetchUserCircles = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('normal_accessToken'); // ✅ JWT 토큰 가져오기

    if (!userId) {
      console.error('❌ 로그인한 사용자 ID가 없습니다.');
      return;
    }
    if (!token) {
      console.error('❌ JWT 토큰이 없습니다. 로그인이 필요합니다.');
      return;
    }

    try {
      console.log('📌 내가 참석한 모임 목록 불러오기...');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/attending-circles`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ JWT 토큰 포함
          },
        }
      );

      console.log('✅ 참석한 모임 목록 응답:', response.data);
      setUserCircles(response.data);
    } catch (error) {
      console.error('❌ 참석한 모임 목록 가져오기 실패:', error);
      if (error.response) {
        console.error('📌 서버 응답 상태 코드:', error.response.status);
        console.error('📌 서버 응답 데이터:', error.response.data);
      }
    }
  };

  useEffect(() => {
    fetchUserCircles();
  }, []);

  return (
    <div className="mypage-circle">
      <h2>내가 참석한 모임</h2>
      {userCircles.length > 0 ? (
        <table className="circle-table">
          <thead>
            <tr>
              <th>모임방 코드</th>
              <th>모임방 제목</th>
              <th>날짜</th>
              <th>장소</th>
            </tr>
          </thead>
          <tbody>
            {userCircles.map((circle) => (
              <tr key={circle.circleId}>
                <td>{circle.circleId}</td>
                <td>{circle.circleName}</td>
                <td>{circle.circleDate}</td>
                <td>{circle.circleAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-posts">참석한 모임이 없습니다.</p>
      )}
    </div>
  );
};

export default MypageCircle;
