import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/circle/CircleDetail.css';
import GoogleMap from './GoogleMap';

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

  return (
    <div className="circle-detail-page">
      <div className="image-banner">
        <img src={post.image || '/default-image.jpg'} alt={post.title} />
      </div>
      <div className="detail-content">
        <h1 className="title">{post.title}</h1>
        <div className="info-section">
          <p className="date">
            📅 {new Date(post.createdDate).toLocaleDateString('ko-KR')}
          </p>
          <p className="time">🕒 {post.time}</p>
          <p className="location">📍 수원시 권선구 오목천로 121</p>
          <p className="description">{post.description}</p>
        </div>
        <div className="match-points">
          <h2>우리 모임의 포인트❗</h2>
          <ul>
            <li>누구나 환영</li>
            <li>준비물 필요 X😝</li>
            <li>장소 확인 필수</li>
            <li>즐겁게 시간 보내기~~</li>
            <li>더이상 뭐라고 써야할지 모르겠어</li>
          </ul>
        </div>
        <div className="googleMap">
          <GoogleMap />
        </div>
        <div className="apply-section">
          <p className="price"> 1/16명</p>
          <button className="apply-button">참석하기</button>
          <button className="back-button" onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
