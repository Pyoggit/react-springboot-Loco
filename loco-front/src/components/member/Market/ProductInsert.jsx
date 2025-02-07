import React, { useState } from 'react';
import GoogleMap from './GoogleMap';
import '@/css/member/market/ProductInsert.css';

const ProductInsert = () => {
  const [products, setProducts] = useState([]);
  const [input, setInput] = useState({
    name: '',
    image: '',
    content: '',
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
      const imageUrl = URL.createObjectURL(file);
      setInput((prev) => ({
        ...prev,
        image: imageUrl, // 이미지 미리보기 URL 저장
      }));
    }
  };

  // 상품 등록 핸들러
  const onSubmit = () => {
    if (!input.name || !input.price || !input.content || !input.image) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const newProduct = {
      id: products.length + 1,
      ...input,
    };

    setProducts((prev) => [...prev, newProduct]); // 상품 리스트 추가
    setInput({ name: '', image: '', content: '', price: '' }); // 입력값 초기화
  };

  return (
    <div className="product-insert">
      <h2>상품 등록</h2>
      <div className="input-container">
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={input.name}
          onChange={onChangeInput}
        />
        <input type="file" name="image" onChange={onChangeFile} />
        {input.image && (
          <img src={input.image} alt="미리보기" className="preview-image" />
        )}
        <textarea
          name="content"
          placeholder="상품 설명"
          value={input.content}
          onChange={onChangeInput}
        />
        <select>
          <option value="스포츠" name="스포츠">
            스포츠
          </option>
          <option value="도서" name="도서">
            도서
          </option>
          <option value="의류" name="의류">
            의류
          </option>
        </select>
        <input
          type="text"
          name="price"
          placeholder="가격"
          value={input.price}
          onChange={onChangeInput}
        />
        <GoogleMap />
        <div className="button-container">
          <button
            className="cancel-button"
            onClick={() =>
              setInput({ name: '', image: '', content: '', price: '' })
            }
          >
            취소하기
          </button>
          <button className="submit-button" onClick={onSubmit}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInsert;
