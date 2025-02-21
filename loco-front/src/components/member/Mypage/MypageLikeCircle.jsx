import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/mypage/MypageLikeCircle.css';

const MypageLikeCircle = () => {
  const [likedCircles, setLikedCircles] = useState([]); // ✅ 좋아요한 모임 리스트
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // ✅ 로그인된 사용자 ID 가져오기

  // ✅ 1. 내가 좋아요한 모임 목록 불러오기
  const fetchLikedCircles = async () => {
    if (!userId) {
      console.error('❌ 사용자 ID 없음. 로그인 필요.');
      return;
    }

    try {
      const token = localStorage.getItem('normal_accessToken'); // 🔥 JWT 토큰 가져오기
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/liked-circles`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ JWT 토큰 포함
          },
        }
      );
      setLikedCircles(response.data); // ✅ 서버에서 받은 데이터 저장
      console.log('✅ 좋아요한 모임 목록:', response.data);
    } catch (error) {
      console.error('❌ 좋아요한 모임 목록 불러오기 실패:', error);
    }
  };

  // ✅ 2. 마운트 시 좋아요한 모임 데이터 불러오기
  useEffect(() => {
    fetchLikedCircles();
  }, []);

  // ✅ 3. 모임 상세 페이지로 이동
  const handleNavigateToDetail = (circle) => {
    localStorage.setItem('selectedPost', JSON.stringify(circle));
    navigate(`/circle/detail/${circle.circleId}`);
  };

  return (
    <div className="mypage-like-circle">
      <h2>관심 모임 목록</h2>
      {likedCircles.length > 0 ? (
        <table className="like-circle-table">
          <thead>
            <tr>
              <th>모임명</th>
              <th>카테고리</th>
              <th>날짜</th>
              <th>장소</th>
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            {likedCircles.map((circle) => (
              <tr key={circle.circleId}>
                <td>{circle.circleName}</td>
                <td>{circle.circleCategory}</td>
                <td>
                  {new Date(circle.circleDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </td>
                <td>{circle.circleAddress}</td>
                <td>
                  <button
                    className="button-like-circle-detail"
                    onClick={() => handleNavigateToDetail(circle)}
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-liked-circles">좋아요한 모임이 없습니다.</p>
      )}
    </div>
  );
};

export default MypageLikeCircle;
