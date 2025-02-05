import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/market/ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const mockData = [
  {
    id: 1,
    name: '상품1',
    image: '이미지1',
    category: '카테고리a',
    content: '설명1',
    price: 1000,
  },
  {
    id: 2,
    name: '상품2',
    image: '이미지2',
    category: '카테고리b',
    content: '설명2',
    price: 2000,
  },
  {
    id: 3,
    name: '상품3',
    image: '이미지3',
    category: '카테고리c',
    content: '설명3',
    price: 3000,
  },
  {
    id: 4,
    name: '상품4',
    image: '이미지4',
    category: '카테고리d',
    content: '설명4',
    price: 4000,
  },
  {
    id: 5,
    name: '상품5',
    image: '이미지5',
    category: '카테고리e',
    content: '설명5',
    price: 5000,
  },
  {
    id: 6,
    name: '상품6',
    image: '이미지6',
    category: '카테고리f',
    content: '설명6',
    price: 6000,
  },
];

const ListItem = ({ id, name, image, category, price }) => {
  const navigate = useNavigate();

  const handleDetailClick = (e) => {
    e.stopPropagation();
    navigate(`/product/info/${id}`);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    alert(`${name} 제품이 장바구니에 추가되었습니다.`);
    navigate('/cart');
  };

  return (
    <div className="listItem">
      <img src={image} alt={name} className="item-image" />
      <div className="item-info">
        <p className="item-name">상품명: {name}</p>
        <p className="item-category">카테고리: {category}</p>
        <p className="item-price">가격: {price.toLocaleString()}원</p>
        <div className="item-buttons">
          <button onClick={handleDetailClick} className="detail-button">
            상세보기
          </button>
          <button onClick={handleCartClick} className="cart-button">
            장바구니
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortType, setSortType] = useState('latest');
  const [searchOpt, setSearchOpt] = useState('name');

  const filteredItems = mockData.filter((item) =>
    searchOpt === 'name'
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : item.category.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredItems].sort((a, b) =>
    sortType === 'oldest'
      ? a.createdDate - b.createdDate
      : b.createdDate - a.createdDate
  );

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
        <div className="btn_insert">
          <button
            className="register-button"
            onClick={() => navigate('/market/insert')}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </div>

      <div className="list">
        <div className="productList">
          {sortedData.length > 0 ? (
            <ul className="product-grid">
              {sortedData.map((item) => (
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
