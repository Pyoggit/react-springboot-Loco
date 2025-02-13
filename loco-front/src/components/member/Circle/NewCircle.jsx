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

const NewCircle = ({ onAddCircle }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: '',
    circleMaxMember: '', // ✅ 최대 인원 필드 추가
    location: '',
    coordinates: { lat: null, lng: null },
    placeId: '',
    pictureData: '', // ✅ Base64 인코딩된 이미지
    pictureId: '', // ✅ 추가: 이미지 ID 저장
  });

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

  /** ✅ 입력값 변경 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 파일 업로드 핸들러 (Base64 변환 + pictureId 생성) */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        pictureData: reader.result, // ✅ Base64 변환된 이미지 저장
        pictureId: `img_${Date.now()}`, // ✅ 파일이 업로드될 때마다 고유 ID 생성
      }));
    };
  };

  /** ✅ 날짜 + 시간 → "yyyy-MM-dd HH:mm:ss" 형식으로 변환 */
  const convertToTimestamp = (date, time) => {
    return `${date} ${time}:00`; // ✅ "YYYY-MM-DD HH:mm:ss" 형식
  };

  /** ✅ 폼 제출 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      date,
      time,
      description,
      category,
      location,
      coordinates,
      pictureData,
      pictureId,
      maxMember, // 최대 인원 추가
    } = formData;

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

    const newCircle = {
      userId: 1,
      circleName: title,
      circleCategory: category,
      circleDate: convertToTimestamp(date, time), // ✅ "yyyy-MM-dd HH:mm:ss" 형식으로 전송
      circleMaxMember: maxMember || 10, // 기본 최대 인원 10명 설정
      circleMember: 0,
      circleDetail: description,
      pictureId: pictureId || 'default',
      pictureUrl: pictureData || '',
      circleAddress: location,
      circleLat: coordinates.lat,
      circleLng: coordinates.lng,
      circlePlaceId: formData.placeId,
    };

    console.log('📤 서버로 전송하는 데이터:', newCircle);

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
      console.error('❌ 모임 추가 실패:', error);
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

        {/* ✅ 최대 인원 입력 필드 추가 */}
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

        {formData.pictureData && (
          <div className="image-preview">
            <img src={formData.pictureData} alt="미리보기" width="100" />
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
