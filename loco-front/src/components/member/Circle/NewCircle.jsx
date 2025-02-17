import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/NewCircle.css';

const categories = [
  '친목',
  '스터디',
  '취미',
  '푸드/드링크',
  '스포츠',
  '여행/동행',
];

const NewCircle = () => {
  const [formData, setFormData] = useState({
    userId: null, // ✅ userId 기본값 추가
    title: '',
    date: '',
    time: '',
    description: '',
    category: '',
    circleMaxMember: 10,
    location: '',
    coordinates: { lat: null, lng: null },
    placeId: '',
    pictureUrl: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  /** ✅ Google Maps 자동완성 */
  useEffect(() => {
    if (!window.google) return;
    const autoComplete = new window.google.maps.places.Autocomplete(
      inputRef.current
    );
    autoComplete.addListener('place_changed', () => {
      const place = autoComplete.getPlace();
      if (place.geometry) {
        setFormData((prev) => ({
          ...prev,
          location: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          placeId: place.place_id,
        }));
      }
    });
  }, []);

  /** ✅ userId를 localStorage에서 가져오기 (지연 로딩) */
  useEffect(() => {
    setTimeout(() => {
      const storedUserId = localStorage.getItem('userId');
      console.log('📌 localStorage에서 가져온 userId:', storedUserId);

      if (storedUserId) {
        setFormData((prev) => ({ ...prev, userId: Number(storedUserId) })); // ✅ 숫자로 변환해서 저장
      } else {
        console.error('❌ userId가 LocalStorage에 없음');
        alert('로그인이 필요합니다.');
        navigate('/login'); // ✅ 로그인 페이지로 이동
      }
    }, 500); // ✅ 0.5초 딜레이 추가 (비동기 처리 보장)
  }, []);

  /** ✅ 입력값 변경 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 파일 선택 핸들러 */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append('file', file);

    console.log('📤 업로드할 파일 데이터:', fileData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles/upload`,
        fileData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        console.log('✅ 파일 업로드 성공:', response.data.filePath);
        setFormData((prev) => ({
          ...prev,
          pictureUrl: response.data.filePath,
        }));
      }
    } catch (error) {
      console.error('❌ 파일 업로드 실패:', error);
      alert('파일 업로드 실패');
    }
  };

  /** ✅ 날짜 + 시간 → "yyyy-MM-dd HH:mm:ss" 형식으로 변환 */
  const convertToTimestamp = (date, time) => {
    return `${date} ${time}:00`;
  };

  /** ✅ 모임 생성 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    console.log('📌 저장된 토큰:', token);
    console.log('📌 현재 formData:', formData);

    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!formData.userId) {
      alert('사용자 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    const newCircleData = {
      userId: formData.userId, // ✅ userId 값이 없으면 안 보냄
      circleName: formData.title,
      circleCategory: formData.category,
      circleDate: convertToTimestamp(formData.date, formData.time),
      circleMaxMember: formData.circleMaxMember,
      circleDetail: formData.description,
      circleAddress: formData.location,
      circleLat: formData.coordinates.lat,
      circleLng: formData.coordinates.lng,
      circlePlaceId: formData.placeId,
      pictureUrl: formData.pictureUrl,
    };

    console.log('📤 전송할 모임 데이터:', newCircleData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles`,
        newCircleData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ 모임 생성 응답:', response);

      if (response.status === 200) {
        alert('모임이 성공적으로 추가되었습니다!');
        navigate('/circle');
      }
    } catch (error) {
      console.error('❌ 모임 추가 실패:', error);
      console.log('⚠️ 서버 응답 데이터:', error.response?.data);
      alert(
        `모임 생성 실패: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="new-circle-form-container">
      <h2>새로운 모임 추가</h2>
      <form onSubmit={handleSubmit} className="new-circle-form">
        <label>모임 제목:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>날짜:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>시간:</label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />

        <label>카테고리:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">카테고리를 선택하세요</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>최대 인원:</label>
        <input
          type="number"
          name="circleMaxMember"
          value={formData.circleMaxMember}
          onChange={handleChange}
          required
          min="1"
        />

        <label>모임 설명:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>모임 장소:</label>
        <input
          type="text"
          ref={inputRef}
          placeholder="모임 장소를 검색하세요"
          required
        />

        <label>사진 첨부:</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {formData.pictureUrl && (
          <div className="image-preview">
            <img src={formData.pictureUrl} alt="미리보기" width="100" />
          </div>
        )}

        <button type="submit" className="submit-button">
          모임 추가
        </button>
      </form>
    </div>
  );
};

export default NewCircle;
