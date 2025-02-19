import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/CircleDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const CircleDetail = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const mapRef = useRef(null);

  /** ✅ Google Maps API를 사용해 지도 초기화 */
  const initMap = (lat, lng) => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.error('❌ Google Maps API가 로드되지 않았습니다.');
      return;
    }

    console.log('✅ Google Maps 초기화 진행:', { lat, lng });

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
    });

    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: '모임 위치',
    });
  };

  /** ✅ 모임 생성자의 이메일 가져오기 (circleId 사용) */
  const fetchCreatorEmail = async (circleId) => {
    try {
      console.log(`📌 모임 생성자의 이메일 요청: circleId=${circleId}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/creator-email`
      );
      console.log('✅ 모임 생성자 이메일 응답:', response.data);
      setPost((prevPost) => ({
        ...prevPost,
        createdByEmail: response.data,
      }));
    } catch (error) {
      console.error('❌ 모임 생성자 이메일 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    const storedPost = localStorage.getItem('selectedPost');
    const storedUserId = localStorage.getItem('userId');

    if (storedPost) {
      const parsedPost = JSON.parse(storedPost);
      setPost(parsedPost);
      setUserId(storedUserId);

      if (storedUserId && parsedPost.createdById) {
        setIsCreator(storedUserId === String(parsedPost.createdById));
      }

      if (!parsedPost.createdByEmail && parsedPost.circleId) {
        fetchCreatorEmail(parsedPost.circleId);
      }

      if (parsedPost.circleLat && parsedPost.circleLng) {
        console.log(
          `📌 위도: ${parsedPost.circleLat}, 경도: ${parsedPost.circleLng}`
        );
        setTimeout(() => {
          initMap(
            parseFloat(parsedPost.circleLat),
            parseFloat(parsedPost.circleLng)
          );
        }, 500); // 지도 로드를 보장하기 위해 약간의 지연
      } else {
        console.error('❌ 모임 위치 데이터가 없습니다.');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="circle-detail-page">
      {/* ✅ 모임 대표 이미지 표시 */}
      <div className="image-banner">
        <img
          src={`${import.meta.env.VITE_API_URL}${post?.pictureUrl}`}
          alt={post?.circleName}
        />
      </div>

      <div className="detail-content">
        <h1 className="title">{post?.circleName}</h1>

        {/* ✅ 모임 생성자 이메일 표시 */}
        <p className="creator-email">
          ✉️ 모임 생성자: {post?.createdByEmail || '정보 없음'}
        </p>

        {/* ✅ 모임 상세 정보 */}
        <div className="info-section">
          <p className="category">📌 카테고리: {post?.circleCategory}</p>
          <p className="date">
            📅 날짜: {new Date(post?.circleDate).toLocaleDateString('ko-KR')}
          </p>
          <p className="time">
            🕑 시간:{' '}
            {new Date(post?.circleDate).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </p>
          <p className="location">📍 장소: {post?.circleAddress}</p>
          <p className="detail">📕 모임 내용: {post?.circleDetail}</p>
        </div>

        {/* ✅ Google Maps 지도 추가 */}
        <div className="map-container">
          <h3>📍 모임 위치</h3>
          <div
            ref={mapRef}
            className="map"
            style={{ width: '100%', height: '300px' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
