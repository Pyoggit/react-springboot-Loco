import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import '@/css/member/market/ProductInsert.css';

const ProductInsert = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    content: '',
    category: '',
    price: '',
    images: [],
    address: '',
    coordinates: { lat: null, lng: null },
    placeId: '',
  });

  const [files, setFiles] = useState([]);
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  /** Google Places API 자동완성 설정 */
  React.useEffect(() => {
    if (!window.google) return;

    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current
    );
    autoCompleteRef.current.addListener('place_changed', () => {
      const place = autoCompleteRef.current.getPlace();
      if (place.geometry) {
        setFormData((prev) => ({
          ...prev,
          address: place.formatted_address,
          coordinates: {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          },
          placeId: place.place_id,
        }));
      }
    });
  }, []);

  /** ✅ 입력 값 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** ✅ 파일 선택 핸들러 */
  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files).slice(0, 3); // 최대 3개 선택
    const imageUrls = fileList.map((file) => URL.createObjectURL(file));

    formData.images.forEach((image) => URL.revokeObjectURL(image));

    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }));

    setFiles(fileList);
  };

  /** ✅ 폼 제출 핸들러 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, content, category, price, address, coordinates } = formData;
    if (
      !name ||
      !content ||
      !category ||
      !price ||
      !address ||
      !coordinates.lat
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // ✅ FormData 생성
    const formDataToSend = new FormData();

    // ✅ JSON 데이터를 Blob 형태로 추가
    const productData = {
      userId: 1, // 로그인된 사용자 ID (테스트용)
      productName: name,
      description: content,
      productCategory: category,
      price: price,
      productAddress: address,
      productLat: coordinates.lat,
      productLng: coordinates.lng,
      productPlaceId: formData.placeId,
    };

    formDataToSend.append(
      'product',
      new Blob([JSON.stringify(productData)], { type: 'application/json' }) // ✅ JSON을 Blob 형태로 변환
    );

    // ✅ 이미지 추가
    files.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/market/insert`, // ✅ .env에서 API URL 가져오기
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다!');
        navigate('/market');
      }
    } catch (error) {
      console.error('상품 등록 실패:', error);
      alert(
        `상품 등록에 실패했습니다: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="product-insert">
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit} className="product-input-container">
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="fileUpload" className="file-label">
          이미지를 선택하세요 (최대 3장)
        </label>
        <input type="file" multiple name="images" onChange={handleFileChange} />
        <div className="product-preview-container">
          {formData.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`미리보기 ${index + 1}`}
              className="product-preview-image"
            />
          ))}
        </div>
        <textarea
          name="content"
          placeholder="상품 설명"
          value={formData.content}
          onChange={handleChange}
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">카테고리 선택</option>
          <option value="스포츠용품">스포츠용품</option>
          <option value="도서">도서</option>
          <option value="의류">의류</option>
          <option value="필기도구">필기도구</option>
          <option value="여행용품">여행용품</option>
          <option value="전자제품">전자제품</option>
        </select>
        <input
          type="text"
          name="price"
          placeholder="가격"
          value={formData.price}
          onChange={handleChange}
        />
        <input
          type="text"
          ref={inputRef}
          placeholder="거래 장소를 검색하세요"
          required
        />
        <GoogleMap />
        <div className="product-insert-button">
          <button className="team-button" onClick={() => navigate(-1)}>
            취소하기
          </button>
          <button className="team-button" type="submit">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInsert;
