import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import '@/css/member/market/ProductInsert.css';

const ProductInsert = () => {
  const navigate = useNavigate();
  // const [products, setProducts] = useState([]);
  const [input, setInput] = useState({
    name: '',
    image: '',
    content: '',
    category: '',
    price: '',
  });

  // 입력값 변경 핸들러
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 선택 시 이미지 미리보기 처리
  const onChangeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (input.image) {
        URL.revokeObjectURL(input.image); // 기존 URL 해제
      }
      const imageUrl = URL.createObjectURL(file);
      setInput((prev) => ({
        ...prev,
        image: imageUrl, // 이미지 미리보기 URL 저장
      }));
    }
  };

  // 입력값 초기화
  const resetInput = () => {
    if (input.image) {
      URL.revokeObjectURL(input.image);
    }
    setInput({ name: '', image: '', content: '', category: '', price: '' });
  };

  // 상품 등록 핸들러
  const onSubmit = () => {
    if (
      !input.name ||
      !input.image ||
      !input.content ||
      !input.category ||
      !input.price
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    alert('상품이 등록되었습니다!');
    resetInput(); // 입력 초기화

    // const newProduct = {
    //   id: products.length + 1,
    //   ...input,
    // };

    // setProducts((prev) => [...prev, newProduct]); // 상품 리스트 추가
    // setInput({ name: '', image: '', content: '', category: '', price: '' }); // 입력값 초기화
  };

  return (
    <div className="product-insert">
      <h2>상품 등록</h2>
      <div className="product-input-container">
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={input.name}
          onChange={onChangeInput}
        />
        <input type="file" name="image" onChange={onChangeFile} />
        {input.image && (
          <img
            src={input.image}
            alt="미리보기"
            className="product-preview-image"
          />
        )}
        <textarea
          name="content"
          placeholder="상품 설명"
          value={input.content}
          onChange={onChangeInput}
        />
        <select name="category" value={input.category} onChange={onChangeInput}>
          <option value="">카테고리 선택</option>
          <option value="스포츠용품">스포츠용품</option>
          <option value="도서">도서</option>
          <option value="의류">의류</option>
          <option value="필기도구">필기도구</option>
          <option value="여행용품">여행용품</option>
          <option value="가전제품">가전제품</option>
        </select>
        <input
          type="text"
          name="price"
          placeholder="가격"
          value={input.price}
          onChange={onChangeInput}
        />
        <GoogleMap />
        <div className="product-insert-button">
          <button className="team-button" onClick={() => navigate(-1)}>
            취소하기
          </button>
          <button className="team-button" onClick={resetInput}>
            다시입력
          </button>
          <button className="team-button" onClick={onSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInsert;
