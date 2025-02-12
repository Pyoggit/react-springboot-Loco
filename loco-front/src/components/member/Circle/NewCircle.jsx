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
    title: '',
    date: '',
    time: '',
    description: '',
    category: '',
    location: '',
    coordinates: { lat: null, lng: null },
    placeId: '',
  });

  const navigate = useNavigate();
  const inputRef = useRef(null);

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

  /** ✅ 입력값 변경 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** ✅ 날짜 + 시간 → Timestamp 변환 */
  const convertToTimestamp = (date, time) => {
    const dateTimeString = `${date}T${time}:00`; // `YYYY-MM-DDTHH:MM:SS` 형식
    return new Date(dateTimeString).toISOString(); // ISO 8601 포맷 변환
  };

  /** ✅ 폼 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, date, time, description, category, location, coordinates } =
      formData;
    if (
      !title ||
      !date ||
      !time ||
      !description ||
      !category ||
      !location ||
      !coordinates.lat
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const timestamp = convertToTimestamp(date, time); // ✅ 날짜 + 시간 변환

    const newCircle = {
      userId: 1,
      circleName: title,
      circleCategory: category,
      circleDate: timestamp, // ✅ 변환된 TIMESTAMP 값
      circleMaxMember: 10,
      circleMember: 0,
      circleDetail: description,
      pictureId: '1',
      pictureUrl: 'https://example.com/image.jpg',
      circleAddress: location,
      circleLat: coordinates.lat,
      circleLng: coordinates.lng,
      circlePlaceId: formData.placeId,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles`,
        newCircle,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        alert('모임이 성공적으로 추가되었습니다!');
        navigate('/circle');
      }
    } catch (error) {
      console.error('모임 추가 실패:', error);
      alert(
        `모임 생성에 실패했습니다: ${
          error.response?.data?.message || error.message
        }`
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

        <button type="submit" className="submit-button">
          모임 추가
        </button>
      </form>
    </div>
  );
};

export default NewCircle;
