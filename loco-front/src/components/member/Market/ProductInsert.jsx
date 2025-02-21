import React, { useState, useRef, useEffect } from 'react';
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

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [files, setFiles] = useState([]);
  const autoCompleteRef = useRef(null);
  const inputRef = useRef(null);

  /** ✅ 로그인한 사용자 정보 가져오기 */
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('normal_accessToken'); // ✅ JWT 토큰 가져오기
      console.log('📌 저장된 accessToken:', token);

      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/mypage`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          console.log('✅ 유저 정보 불러오기 성공:', response.data);
          setUserId(response.data.userId);
          setAccessToken(token);
        } else {
          alert('사용자 정보를 불러올 수 없습니다.');
          navigate('/login');
        }
      } catch (error) {
        console.error('🚨 사용자 정보 불러오기 실패:', error);
        alert('로그인이 필요합니다.');
        navigate('/login');
      }
    };

    fetchUserInfo();
  }, [navigate]);

  /** Google Places API 자동완성 설정 */
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
    const fileList = Array.from(e.target.files).slice(0, 3);
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

    console.log('📌 제출 전 로그인 사용자 ID:', userId);
    console.log('📌 제출 전 accessToken:', accessToken);

    if (!userId || !accessToken) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    const priceValue = Number(formData.price);
    if (
      !formData.name ||
      !formData.content ||
      !formData.category ||
      isNaN(priceValue) ||
      !formData.address
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const formDataToSend = new FormData();

    const productData = {
      userId: userId, // ✅ 로그인된 사용자 ID 추가
      productName: formData.name,
      description: formData.content,
      productCategory: formData.category,
      price: priceValue,
      productAddress: formData.address,
      productLat: formData.coordinates.lat,
      productLng: formData.coordinates.lng,
      productPlaceId: formData.placeId,
    };

    formDataToSend.append(
      'product',
      new Blob([JSON.stringify(productData)], { type: 'application/json' })
    );

    files.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      console.log('🚀 상품 등록 요청 데이터:', productData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/market/insert`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`, // ✅ 토큰 포함
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert('상품이 성공적으로 등록되었습니다!');
        navigate('/market');
      }
    } catch (error) {
      console.error('🚨 상품 등록 실패:', error);
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
          name="address"
          ref={inputRef}
          placeholder="거래 장소를 검색하세요"
          value={formData.address}
          onChange={handleChange}
          required
        />
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
