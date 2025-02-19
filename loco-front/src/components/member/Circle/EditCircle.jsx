import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/circle/EditCircle.css';

const categories = [
  '친목',
  '스터디',
  '취미',
  '푸드/드링크',
  '스포츠',
  '여행/동행',
];

const EditCircle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { post } = location.state || {};
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: post?.circleName || '',
    date: post?.circleDate?.split(' ')[0] || '',
    time: post?.circleDate?.split(' ')[1]?.slice(0, 5) || '',
    description: post?.circleDetail || '',
    category: post?.circleCategory || '',
    circleMaxMember: post?.circleMaxMember || '',
    location: post?.circleAddress || '',
    coordinates: { lat: post?.circleLat || null, lng: post?.circleLng || null },
    placeId: post?.circlePlaceId || '',
    pictureUrl: post?.pictureUrl || '',
    pictureId: post?.pictureId || '',
    newFile: null, // 새로 업로드할 파일 상태 추가
  });

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

    return () => {
      window.google.maps.event.clearInstanceListeners(autoComplete);
    };
  }, [inputRef]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** ✅ 파일 변경 핸들러 */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      newFile: file, // 새 파일 저장
    }));
  };

  /** ✅ 이미지 URL 생성 함수 */
  const getImageUrl = () => {
    if (formData.newFile) {
      return URL.createObjectURL(formData.newFile);
    }
    if (!formData.pictureUrl) {
      return '/images/default-image.png';
    }
    if (formData.pictureUrl.startsWith('http')) {
      return formData.pictureUrl;
    }

    // ✅ 캐싱 방지 (timestamp 추가)
    const timestamp = new Date().getTime();
    return `${import.meta.env.VITE_API_URL}${
      formData.pictureUrl
    }?t=${timestamp}`;
  };

  /** ✅ 모임 정보 업데이트 */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!window.confirm('모임 정보를 수정하시겠습니까?')) return;

    const formDataToSend = new FormData();
    formDataToSend.append('circleName', formData.title);
    formDataToSend.append('circleCategory', formData.category);
    formDataToSend.append('circleDate', `${formData.date} ${formData.time}:00`);
    formDataToSend.append('circleMaxMember', formData.circleMaxMember);
    formDataToSend.append('circleDetail', formData.description);
    formDataToSend.append('circleAddress', formData.location);
    formDataToSend.append('circleLat', formData.coordinates.lat);
    formDataToSend.append('circleLng', formData.coordinates.lng);
    formDataToSend.append('circlePlaceId', formData.placeId);
    formDataToSend.append('pictureId', formData.pictureId);
    formDataToSend.append('pictureUrl', formData.pictureUrl);

    // ✅ 파일이 선택된 경우에만 추가
    if (formData.newFile) {
      formDataToSend.append('file', formData.newFile);
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}`,
        formDataToSend,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        }
      );

      if (response.status === 200) {
        alert('모임 정보가 수정되었습니다.');

        const updatedPost = {
          ...post,
          pictureUrl: response.data.pictureUrl, // ✅ 최신 pictureUrl 반영
        };

        // ✅ localStorage 업데이트 (최신 이미지 반영)
        localStorage.setItem('selectedPost', JSON.stringify(updatedPost));

        setFormData((prev) => ({
          ...prev,
          pictureUrl: response.data.pictureUrl,
        }));

        navigate(`/circle/detail/${post.circleId}`);
      }
    } catch (error) {
      console.error('❌ 수정 실패:', error);
      alert(
        `수정에 실패했습니다: ${error.response?.data?.message || error.message}`
      );
    }
  };

  return (
    <div className="edit-circle-form-container">
      <h2>모임 수정</h2>
      <form onSubmit={handleUpdate} className="edit-circle-form">
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
          value={formData.location}
          onChange={handleChange}
          name="location"
          placeholder="모임 장소를 검색하세요"
          required
        />

        <label>사진 변경:</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <div className="image-preview">
          <img src={getImageUrl()} alt="미리보기" width="100" />
        </div>

        <button type="submit" className="submit-button">
          모임 수정
        </button>
      </form>
    </div>
  );
};

export default EditCircle;
