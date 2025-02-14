import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import GoogleMap from './GoogleMap';
import '@/css/member/market/ProductInsert.css';

const ProductUpdate = () => {
  const { id } = useParams();
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

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 기존 상품 정보 불러오기 */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/info/${id}`
        );
        const product = response.data;

        setFormData({
          name: product.productName,
          content: product.description,
          category: product.productCategory,
          price: product.price,
          address: product.productAddress,
          coordinates: {
            lat: product.productLat,
            lng: product.productLng,
          },
          placeId: product.productPlaceId,
        });

        // 기존 이미지 URL 설정
        setExistingImages(
          product.images.map(
            (img) => `${import.meta.env.VITE_API_URL}/upload/${img.pictureUrl}`
          )
        );
      } catch (error) {
        console.error('상품 정보를 불러오는 중 오류 발생:', error);
        alert('존재하지 않는 상품입니다.');
        navigate('/market', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div>데이터 로딩중...!</div>;
  }

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

    setNewFiles(fileList);
    setExistingImages(imageUrls);
  };

  /** ✅ 상품 수정 요청 */
  const handleUpdate = async () => {
    if (
      !formData.name ||
      !formData.content ||
      !formData.category ||
      !formData.price
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const formDataToSend = new FormData();

    // ✅ JSON 데이터를 Blob 형태로 추가
    const updatedProductData = {
      productId: id,
      productName: formData.name,
      description: formData.content,
      productCategory: formData.category,
      price: Number(formData.price),
      productAddress: formData.address,
      productLat: formData.coordinates.lat,
      productLng: formData.coordinates.lng,
      productPlaceId: formData.placeId,
    };

    formDataToSend.append(
      'product',
      new Blob([JSON.stringify(updatedProductData)], {
        type: 'application/json',
      })
    );

    // ✅ 새로운 이미지 추가
    newFiles.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/market/update/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('상품이 성공적으로 수정되었습니다!');
        navigate(`/market/info/${id}`);
      }
    } catch (error) {
      console.error('상품 수정 실패:', error);
      alert('상품 수정에 실패했습니다.');
    }
  };

  return (
    <div className="product-insert">
      <h2>상품 수정</h2>
      <form className="product-input-container">
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="fileUpload" className="file-label">
          새로운 이미지를 선택하세요 (최대 3장)
        </label>
        <input
          type="file"
          multiple
          name="images"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="product-preview-container">
          {existingImages.map((image, index) => (
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
          placeholder="거래 장소를 검색하세요"
          value={formData.address}
          readOnly
        />
        <GoogleMap />
        <div className="product-insert-button">
          <button className="team-button" onClick={() => navigate(-1)}>
            취소하기
          </button>
          <button className="team-button" type="button" onClick={handleUpdate}>
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdate;
