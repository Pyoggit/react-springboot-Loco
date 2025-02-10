import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/market/ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 꽉 찬 하트
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트
import Payment from './Payment';

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

const ListItem = ({ id, name, image, category, price }) => {
  const navigate = useNavigate();

  const handleDetailClick = (e) => {
    e.stopPropagation();
    navigate(`/market/info/${id}`);
  };

  const [isLikeClick, setIsLikeClick] = useState(false);

  return (
    <div className="productList-Item">
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
        <img src={image} alt={name} className="item-image" />
        <div className="item-info">
          <p className="item-name">상품명: {name}</p>
          <p className="item-category">카테고리: {category}</p>
          <p className="item-price">가격: {price.toLocaleString()}원</p>
          <div className="product-item-button">
            <button onClick={handleDetailClick} className="team-button">
              상세보기
            </button>
            <Payment amount={price} orderName={name} />
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

  const categories = [
    '전체',
    '스포츠용품',
    '도서',
    '의류',
    '필기도구',
    '여행용품',
    '가전제품',
  ];

  const filteredItems = mockData.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch =
      searchOpt === 'name'
        ? item.name.toLowerCase().includes(search.toLowerCase())
        : item.category.toLowerCase().includes(search.toLowerCase());
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
              onClick={() => setSelectedCategory(category)} // 클릭 시 카테고리 선택
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

      <div className="marketList">
        <div className="productList">
          {filteredItems.length > 0 ? (
            <ul className="product-grid">
              {filteredItems.map((item) => (
                <ListItem key={item.id} {...item} />
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
