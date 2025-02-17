import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 꽉 찬 하트
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트

const ListItem = ({
  productId,
  productName,
  images,
  productCategory,
  price,
  userName, // 판매자 이름 추가
}) => {
  const navigate = useNavigate();
  const [isLikeClick, setIsLikeClick] = useState(false);

  const handleDetailClick = (e) => {
    e.stopPropagation();
    navigate(`/market/info/${productId}`);
  };

  // 백엔드에서 저장된 파일명(pictureUrl)만 받아오므로, 정적 리소스 매핑 경로와 결합합니다.
  const thumbnail =
    images && images.length > 0
      ? `${import.meta.env.VITE_API_URL}/upload/${images[0].pictureUrl}`
      : '/default-placeholder.png';

  return (
    <div className="product-List-Item">
      <div className="like-button">
        <button
          className="like-button"
          onClick={() => setIsLikeClick((prev) => !prev)}
        >
          <FontAwesomeIcon
            icon={isLikeClick ? solidHeart : regularHeart}
            className="like-icon"
          />
        </button>
      </div>
      <div className="product-list">
        <img src={thumbnail} alt={productName} className="product-image" />
        <div className="product-info">
          <p className="product-name">상품명: {productName}</p>
          <p className="product-category">카테고리: {productCategory}</p>
          <p className="product-price">가격: {price.toLocaleString()}원</p>
          <p className="product-seller">판매자: {userName}</p>{' '}
          {/* 판매자 정보 표시 */}
          <div className="product-item-button">
            <button onClick={handleDetailClick} className="team-button">
              상세보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchOpt, setSearchOpt] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [products, setProducts] = useState([]);

  const categories = [
    '전체',
    '스포츠용품',
    '도서',
    '의류',
    '필기도구',
    '여행용품',
    '전자제품',
  ];

  // 컴포넌트가 마운트될 때 등록된 상품들을 API로 불러옵니다.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/products`
        );
        // 백엔드에서 반환하는 데이터 형식에 맞게 수정하세요.
        setProducts(response.data);
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = products.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.productCategory === selectedCategory;
    const matchesSearch =
      searchOpt === 'name'
        ? item.productName.toLowerCase().includes(search.toLowerCase())
        : item.productCategory.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="productPage">
      <div className="topBar">
        <div className="searchBar">
          <select onChange={(e) => setSearchOpt(e.target.value)}>
            <option value="name">상품명</option>
            <option value="category">카테고리</option>
          </select>
          <input
            type="text"
            placeholder="검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <section className="market-category">
        <div className="market-category-container">
          {categories.map((category, index) => (
            <span
              key={index}
              className={`market-category-item ${
                selectedCategory === category ? 'active' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </span>
          ))}
        </div>
      </section>
      <div className="product-register-button">
        <button
          className="register-button"
          onClick={() => navigate('/market/insert')}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
      <div className="product-delete-button">
        <button
          className="delete-button"
          onClick={() => navigate('/market/remove')}
        >
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </div>
      <div className="marketList">
        <div className="productList">
          {filteredItems.length > 0 ? (
            <ul className="product-grid">
              {filteredItems.map((item) => (
                <li key={item.productId}>
                  <ListItem {...item} userName={item.userName} />{' '}
                  {/* 판매자 정보 전달 */}
                </li>
              ))}
            </ul>
          ) : (
            <p>결과가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
