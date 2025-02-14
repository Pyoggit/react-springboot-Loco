import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/CircleDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CircleDetail = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const storedPost = localStorage.getItem('selectedPost');
    if (storedPost) {
      setPost(JSON.parse(storedPost));
    } else {
      navigate('/'); // 데이터가 없으면 홈으로 이동
    }
  }, [navigate]);

  if (!post) {
    return <div>존재하지 않는 모임입니다.</div>;
  }

  /** ✅ 삭제 기능 추가 */
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return; // ✅ 삭제 확인 알림

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert('모임이 삭제되었습니다.');
        navigate('/circle'); // ✅ 삭제 후 CircleMain으로 이동
      }
    } catch (error) {
      console.error('❌ 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="circle-detail-page">
      {/* ✅ 모임 대표 이미지 표시 */}
      <div className="image-banner">
        <img
          src={post.pictureUrl || '/images/default-image.png'}
          alt={post.circleName}
        />
      </div>

      <div className="detail-content">
        <h1 className="title">{post.circleName}</h1>

        {/* ✅ 모임 상세 정보 */}
        <div className="info-section">
          <p className="category">📌 카테고리: {post.circleCategory}</p>
          <p className="date">
            📅 날짜: {new Date(post.circleDate).toLocaleDateString('ko-KR')}
          </p>
          <p className="status">🔄 상태: {post.circleStatus}</p>
          <p className="members">
            👥 참가자: {post.circleMember} / {post.circleMaxMember}
          </p>
          <p className="location">📍 장소: {post.circleAddress}</p>
        </div>

        {/* ✅ 지도에서 저장된 장소 표시 */}
        <div className="googleMap">
          <iframe
            title="모임 위치"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '10px' }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=${
              import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }
            &q=${encodeURIComponent(post.circleAddress)}`}
          ></iframe>
        </div>

        {/* ✅ 참여 버튼 및 삭제 버튼 추가 */}
        <div className="apply-section">
          <button className="apply-button">참석하기</button>
          <button className="back-button" onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
          <button className="delete-button" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
