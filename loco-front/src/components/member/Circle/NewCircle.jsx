import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/circle/NewCircle.css";

const categories = [
  "친목",
  "스터디",
  "취미",
  "푸드/드링크",
  "스포츠",
  "여행/동행",
];

const NewCircle = () => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    category: "",
    circleMaxMember: 10, // 기본 최대 인원 설정
    location: "",
    coordinates: { lat: null, lng: null },
    placeId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null); // ✅ 파일 저장
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  /** ✅ Google Maps 자동완성 */
  useEffect(() => {
    if (!window.google) return;
    const autoComplete = new window.google.maps.places.Autocomplete(
      inputRef.current
    );
    autoComplete.addListener("place_changed", () => {
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

  /** ✅ 파일 선택 핸들러 */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setFormData((prev) => ({
          ...prev,
          pictureUrl: response.data.filePath, // ✅ 서버에서 반환된 업로드된 파일 URL 저장
        }));
      }
    } catch (error) {
      console.error("❌ 파일 업로드 실패:", error);
      alert("파일 업로드 실패");
    }
  };

  /** ✅ 날짜 + 시간 → "yyyy-MM-dd HH:mm:ss" 형식으로 변환 */
  const convertToTimestamp = (date, time) => {
    return `${date} ${time}:00`;
  };

  /** ✅ 모임 생성 요청 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formDataToSend = new FormData();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/circles`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("모임이 성공적으로 추가되었습니다!");
        navigate("/circle");
      }
    } catch (error) {
      console.error("❌ 모임 추가 실패:", error);
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

        {selectedFile && (
          <div className="image-preview">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="미리보기"
              width="100"
            />
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
