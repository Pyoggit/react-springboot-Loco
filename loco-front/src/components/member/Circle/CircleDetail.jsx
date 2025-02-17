import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/CircleDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const CircleDetail = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [attendees, setAttendees] = useState([]); // 참석자 목록
  const [isAttending, setIsAttending] = useState(false); // 참석 여부 확인
  const token = localStorage.getItem('token');

  useEffect(() => {
    const storedPost = localStorage.getItem('selectedPost');
    if (storedPost) {
      const parsedPost = JSON.parse(storedPost);
      setPost(parsedPost);
      fetchAttendees(parsedPost.circleId);
      checkUserAttendance(parsedPost.circleId);
    } else {
      navigate('/');
    }
  }, [navigate]);

  /** ✅ 참석한 사용자 목록 불러오기 */
  const fetchAttendees = async (circleId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/attendees`
      );
      setAttendees(response.data);
    } catch (error) {
      console.error('❌ 참석자 목록 불러오기 실패:', error);
    }
  };

  /** ✅ 현재 로그인한 유저가 참석 중인지 확인 */
  const checkUserAttendance = async (circleId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/isAttending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsAttending(response.data);
    } catch (error) {
      console.error('❌ 참석 여부 확인 실패:', error);
    }
  };

  /** ✅ 참석 기능 */
  const handleAttendToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      let response;
      if (isAttending) {
        response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/cancel`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 JWT 토큰 포함
            },
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/attend`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔥 JWT 토큰 포함
              'Content-Type': 'application/json',
            },
          }
        );
      }

      if (response.status === 200) {
        alert(
          isAttending
            ? '모임 참석이 취소되었습니다!'
            : '모임 참석이 완료되었습니다!'
        );
        setIsAttending(!isAttending); // ✅ 상태 업데이트
        fetchAttendees(post.circleId); // ✅ 참석자 목록 다시 불러오기
      }
    } catch (error) {
      console.error('❌ 참석 변경 실패:', error);
      alert(
        `참석 변경 실패: ${error.response?.data?.message || error.message}`
      );
    }
  };
  /** ✅ 모임 삭제 */
  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('모임이 삭제되었습니다.');
      navigate('/circle');
    } catch (error) {
      console.error('❌ 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  /** ✅ 수정하기 */
  const handleEdit = () => {
    navigate(`/circle/edit/${post.circleId}`, { state: { post } });
  };

  return (
    <div className="circle-detail-page">
      {/* ✅ 모임 대표 이미지 표시 */}
      <div className="image-banner">
        <img
          src={
            post?.pictureUrl
              ? post.pictureUrl.startsWith('http')
                ? post.pictureUrl
                : `${import.meta.env.VITE_API_URL}/upload/${post.pictureUrl}`
              : '/images/default-image.png'
          }
          alt={post?.circleName}
        />
      </div>

      <div className="detail-content">
        <h1 className="title">{post?.circleName}</h1>

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
          <p className="status">🔄 상태: {post?.circleStatus}</p>
          <p className="members">
            👥 참가자: {attendees.length} / {post?.circleMaxMember}
          </p>
          <p className="location">📍 장소: {post?.circleAddress}</p>
          <p className="detail">📕 모임 내용: {post?.circleDetail}</p>
        </div>

        {/* ✅ 참석자 목록 */}
        <div className="attendee-section">
          <h3>참석한 사람들</h3>
          <ul>
            {attendees.length > 0 ? (
              attendees.map((attendee) => (
                <li key={attendee.userId}>{attendee.userName}</li>
              ))
            ) : (
              <p>아직 참석한 사람이 없습니다.</p>
            )}
          </ul>
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
            &q=${encodeURIComponent(post?.circleAddress)}`}
          ></iframe>
        </div>

        {/* ✅ 버튼 섹션 */}
        <div className="apply-section">
          <button className="apply-button" onClick={handleAttendToggle}>
            {isAttending ? '참석 취소' : '참석하기'}
          </button>
          <button className="back-button" onClick={() => navigate(-1)}>
            뒤로 가기
          </button>
          <br />
          <button className="edit-button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faEdit} /> 수정하기
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
