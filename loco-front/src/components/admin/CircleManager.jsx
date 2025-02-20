import React, { useEffect, useState } from 'react';
import axios from '@/utils/AxiosConfig';
import '@/css/admin/CircleManager.css';

const CircleManager = () => {
  const [circles, setCircles] = useState([]);

  /** ✅ 모임 리스트 가져오기 */
  const fetchCircles = async () => {
    try {
      const response = await axios.get('/api/circles/admin'); // ✅ 수정된 엔드포인트
      console.log('✅ 관리자 모드 모임 리스트:', response.data);
      setCircles(response.data);
    } catch (error) {
      console.error('❌ 모임 리스트 가져오기 실패:', error);
    }
  };
  // 모임삭제 기능
  const handleDeleteCircle = async (circleId) => {
    if (!window.confirm('정말로 이 모임을 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('normal_accessToken');

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/circles/${circleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ JWT 토큰 추가
          },
        }
      );

      alert('모임이 삭제되었습니다.');
      fetchCircles(); // ✅ 삭제 후 리스트 갱신
    } catch (error) {
      console.error('❌ 모임 삭제 실패:', error);
    }
  };
  useEffect(() => {
    fetchCircles();
  }, []);

  return (
    <div className="admin-circle-container">
      <table className="admin-circle-table">
        <thead>
          <tr>
            <th>모임방 코드</th>
            <th>개설자</th>
            <th>이메일</th>
            <th>모임방 제목</th>
            <th>지역</th>
            <th>개설일자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {circles.map((circle) => (
            <tr key={circle.circleId}>
              <td>{circle.circleId}</td>
              <td>{circle.creatorName || '이름 없음'}</td>{' '}
              {/* ✅ 개설자 이름 */}
              <td>{circle.creatorEmail || '이메일 없음'}</td>{' '}
              {/* ✅ 개설자 이메일 */}
              <td>{circle.circleName}</td>
              <td>{circle.circleAddress}</td>
              <td>{circle.circleDate}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteCircle(circle.circleId)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CircleManager;
