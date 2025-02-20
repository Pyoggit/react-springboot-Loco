import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/CircleDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const CircleDetail = () => {
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('userEmail');

  const [post, setPost] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [isAttending, setIsAttending] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState(null);
  const [userEmail, setUserEmail] = useState(null); // 🔥 로그인한 유저 이메일 상태 추가
  const mapRef = useRef(null);

  /** ✅ Google Maps API를 사용해 지도 초기화 */
  const initMap = (lat, lng) => {
    if (!window.google || !window.google.maps || !mapRef.current) {
      console.error('❌ Google Maps API가 로드되지 않았습니다.');
      return;
    }

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

  /** ✅ 모임 생성자의 이메일 가져오기 */
  const fetchCreatorEmail = async (circleId) => {
    if (!circleId || creatorEmail) return; // 🔥 이미 이메일이 있으면 재요청 방지

    try {
      console.log(`📌 모임 생성자의 이메일 요청: circleId=${circleId}`);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/creator-email`
      );
      console.log('✅ 모임 생성자 데이터 응답:', response.data);
      setCreatorEmail(response.data);
    } catch (error) {
      console.error('❌ 모임 생성자 이메일 가져오기 실패:', error);
    }
  };

  const fetchUserEmail = async (userId, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.email) {
        localStorage.setItem('userEmail', response.data.email);
        console.log('✅ 저장된 이메일:', localStorage.getItem('userEmail'));
      } else {
        console.error('❌ 이메일을 가져오지 못함:', response.data);
      }
    } catch (error) {
      console.error('❌ 이메일 가져오기 실패:', error);
    }
  };
  useEffect(() => {
    console.log('🔥 isAttending 상태 업데이트됨:', isAttending);
  }, [isAttending]);
  /** ✅ 참석자 목록 가져오기 */
  const fetchAttendees = async () => {
    if (!post?.circleId || !userId) return; // ✅ userId가 null이면 실행하지 않음

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/attendees`
      );

      console.log('📌 참석자 목록 응답:', response.data);
      setAttendees(response.data);

      const isUserAttending = response.data.some(
        (user) => String(user.userId) === String(userId)
      );
      console.log('🔥 로그인한 유저가 참석했는가?', isUserAttending);

      setIsAttending(isUserAttending); // ✅ 상태 업데이트
    } catch (error) {
      console.error('❌ 참석자 목록 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    console.log('✅ 참석 버튼 조건 확인:');
    console.log('📌 userId:', userId);
    console.log('📌 isCreator:', isCreator);
    console.log('📌 isAttending:', isAttending);
  }, [userId, isCreator, isAttending]);

  /** ✅ 모임 참석 */
  const handleAttend = async () => {
    if (!userId) {
      alert('로그인이 필요합니다!');
      return navigate('/login');
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/attend`,
        { userId }
      );
      fetchAttendees();
    } catch (error) {
      console.error('❌ 참석 요청 실패:', error);
    }
  };

  /** ✅ 참석 취소 */
  const handleCancelAttendance = async () => {
    if (!userId) {
      alert('로그인이 필요합니다!');
      return navigate('/login');
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/cancel`,
        { data: { userId: String(userId) } }
      );
      fetchAttendees();
    } catch (error) {
      console.error('❌ 참석 취소 실패:', error);
    }
  };

  /** ✅ 모임 삭제 */
  const handleDeleteCircle = async () => {
    if (!post || !post.circleId) {
      console.error('❌ 삭제하려는 모임의 circleId가 없음!');
      return;
    }

    console.log('🗑️ 삭제 버튼 클릭됨!');
    if (!window.confirm('정말로 이 모임을 삭제하시겠습니까?')) return;

    try {
      console.log(`🗑️ 삭제 요청: circleId=${post.circleId}`); // 확인용 로그

      const token = localStorage.getItem('normal_accessToken');

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 JWT 토큰 추가
          },
        }
      );

      alert('모임이 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('❌ 모임 삭제 실패:', error);
    }
  };

  /** ✅ 모임 수정 (이동) */
  const handleEditCircle = () => {
    if (!post || !post.circleId) {
      console.error('❌ 수정하려는 모임의 circleId가 없음!');
      return;
    }
    console.log(`📝 수정 버튼 클릭됨! circleId=${post.circleId}`, {
      state: post,
    });

    navigate(`/circle/edit/${post.circleId}`, { state: { post } });
  };
  useEffect(() => {
    const storedPost = localStorage.getItem('selectedPost');
    const storedUserId = localStorage.getItem('userId');

    if (storedPost) {
      const parsedPost = JSON.parse(storedPost);
      console.log('📌 저장된 모임 데이터:', parsedPost);

      setPost(parsedPost);
      setUserId(storedUserId);

      console.log('📌 로그인한 유저 ID:', storedUserId);
      console.log(
        '📌 모임 생성자 ID (프론트에서 받은 데이터):',
        parsedPost.createdById
      ); // ✅ 확인용

      if (storedUserId && parsedPost.createdById) {
        setIsCreator(String(storedUserId) === String(parsedPost.createdById));
        console.log(
          `🔥 isCreator 상태: ${
            String(storedUserId) === String(parsedPost.createdById)
          }`
        );
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (post?.circleId) {
      fetchAttendees();
      fetchCreatorEmail(post.circleId);

      console.log('📌 로그인한 유저 ID:', userId);
      console.log(
        '📌 모임 생성자 ID (프론트에서 받은 데이터):',
        post.createdById
      ); // ✅ 여기서 확인!

      if (userId && post.createdById) {
        setIsCreator(String(userId) === String(post.createdById));
        console.log(
          `🔥 isCreator 상태: ${String(userId) === String(post.createdById)}`
        );
      }

      // 지도 초기화
      if (post.circleLat && post.circleLng) {
        initMap(post.circleLat, post.circleLng);
      }
    }
  }, [post, userId]);

  useEffect(() => {
    console.log('🔥 isAttending 상태 업데이트됨:', isAttending);
  }, [isAttending]);

  useEffect(() => {
    if (post?.circleId) {
      fetchAttendees();
    }
  }, [post, userId]);

  useEffect(() => {
    console.log('📌 로그인한 유저 이메일:', storedEmail);
    console.log('📌 모임 생성자 이메일:', creatorEmail);

    if (storedEmail && creatorEmail) {
      const isCreatorMatch =
        storedEmail.trim().toLowerCase() === creatorEmail.trim().toLowerCase();
      setIsCreator(isCreatorMatch);
      console.log(`🔥 isCreator 상태 업데이트됨: ${isCreatorMatch}`);
    } else {
      console.log('⚠️ 이메일 비교가 불가능함 (값이 null일 가능성 있음)');
      setIsCreator(false);
    }
  }, [storedEmail, creatorEmail]);

  useEffect(() => {
    console.log('🛠 `isAttending` 변경 후 상태 확인:', isAttending);
  }, [isAttending]); // ✅ isAttending이 변경될 때 실행

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');

    console.log('📌 로컬스토리지에서 불러온 userId:', storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
      fetchAttendees(); // ✅ userId가 설정된 직후 `fetchAttendees()` 실행
    }
  }, []);
  return (
    <div className="circle-detail-page">
      <div className="image-banner">
        <img
          src={`${import.meta.env.VITE_API_URL}${post?.pictureUrl}`}
          alt={post?.circleName}
        />
      </div>

      <div className="detail-content">
        <h1 className="title">{post?.circleName}</h1>

        <p className="creator-email">
          ✉️ 모임 생성자: {creatorEmail || '정보 없음'}
        </p>

        <div className="attendees-list">
          <h3>👥 참석자 목록</h3>
          <ul>
            {attendees.map((user) => (
              <li key={user.userId}>{user.userName}</li>
            ))}
          </ul>
        </div>

        {userId &&
          !isCreator &&
          (isAttending ? (
            <button
              className="circle-attend-btn cancel"
              onClick={handleCancelAttendance}
            >
              참석 취소
            </button>
          ) : (
            <button className="circle-attend-btn" onClick={handleAttend}>
              모임 참석하기
            </button>
          ))}

        <div className="info-section">
          <p className="category">📌 카테고리: {post?.circleCategory}</p>
          <p className="location">📍 장소: {post?.circleAddress}</p>
          <p className="detail">📕 모임 내용: {post?.circleDetail}</p>
          <p className="attendees-count">
            👥 현재 참석 인원: {attendees.length}/{post?.circleMaxMember}
          </p>
        </div>

        <div className="map-container">
          <h3>📍 모임 위치</h3>
          <div
            ref={mapRef}
            className="map"
            style={{ width: '100%', height: '300px' }}
          ></div>
          {post &&
            storedEmail &&
            creatorEmail &&
            storedEmail === creatorEmail && (
              <div className="admin-buttons">
                <button className="edit-btn" onClick={handleEditCircle}>
                  <FontAwesomeIcon icon={faEdit} /> 수정
                </button>
                <button className="delete-btn" onClick={handleDeleteCircle}>
                  <FontAwesomeIcon icon={faTrash} /> 삭제
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CircleDetail;
