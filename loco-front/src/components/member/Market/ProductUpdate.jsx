import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GoogleMap from './GoogleMap';
import '@/css/member/market/ProductInsert.css';

// 가짜 데이터 (실제 API 연동 시 제거)
const mockData = [
  {
    id: 1,
    name: '상품1',
    image: '이미지1',
    category: '스포츠용품',
    content: '설명1',
    price: 1000,
  },
  {
    id: 2,
    name: '상품2',
    image: '이미지2',
    category: '도서',
    content: '설명2',
    price: 2000,
  },
  {
    id: 3,
    name: '상품3',
    image: '이미지3',
    category: '의류',
    content: '설명3',
    price: 3000,
  },
  {
    id: 4,
    name: '상품4',
    image: '이미지4',
    category: '필기도구',
    content: '설명4',
    price: 4000,
  },
  {
    id: 5,
    name: '상품5',
    image: '이미지5',
    category: '여행용품',
    content: '설명5',
    price: 5000,
  },
  {
    id: 6,
    name: '상품6',
    image: '이미지6',
    category: '가전제품',
    content: '설명6',
    price: 6000,
  },
];

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    name: '',
    image: '',
    content: '',
    category: '',
    price: '',
  });

  // 기존 상품 정보 불러오기
  useEffect(() => {
    const product = mockData.find((p) => p.id === Number(id));
    if (!product) {
      alert('존재하지 않는 상품입니다.');
      navigate(-1);
      return;
    }
    setInput(product);
  }, [id, navigate]);

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
        URL.revokeObjectURL(input.image);
      }
      const imageUrl = URL.createObjectURL(file);
      setInput((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  // 입력값 초기화
  const resetInput = () => {
    setInput({ name: '', image: '', content: '', category: '', price: '' });
  };

  // 상품 수정 핸들러
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

    alert('상품이 수정되었습니다!');
    navigate(-1);
  };

  return (
    <div className="product-insert">
      <h2>상품 수정</h2>
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
          <option value="스포츠">스포츠</option>
          <option value="도서">도서</option>
          <option value="의류">의류</option>
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
          <button className="team-button reset-btn" onClick={resetInput}>
            다시입력
          </button>
          <button className="team-button" onClick={onSubmit}>
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
