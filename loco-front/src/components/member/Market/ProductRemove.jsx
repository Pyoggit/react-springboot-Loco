import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/market/ProductRemove.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
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

const ListItem = ({ id, name, image, category, price, isChecked, onCheck }) => {
  const navigate = useNavigate();

  return (
    <div className="productList-Item">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onCheck(id)}
        className="product-checkbox"
      />
      <div className="product-list">
        <img src={image} alt={name} className="item-image" />
        <div className="item-info">
          <p className="item-name">상품명: {name}</p>
          <p className="item-category">카테고리: {category}</p>
          <p className="item-price">가격: {price.toLocaleString()}원</p>
          <div className="product-item-button">
            <button
              onClick={() => navigate(`/market/info/${id}`)}
              className="team-button"
            >
              상세보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductRemove() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [searchOpt, setSearchOpt] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState(mockData);

  const categories = [
    '전체',
    '스포츠용품',
    '도서',
    '의류',
    '필기도구',
    '여행용품',
    '가전제품',
  ];

  const handleCheck = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRemoveSelected = () => {
    setItems(items.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map((item) => item.id));
    }
  };

  const filteredItems = items.filter((item) => {
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
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </span>
          ))}
        </div>
      </section>
      <div className="product-remove-button">
        <button className="remove-button" onClick={handleRemoveSelected}>
          <FontAwesomeIcon icon={faMinus} />
        </button>
      </div>
      <div className="remove-checkBox">
        <div className="select-all" onClick={handleSelectAll}>
          <input
            type="checkbox"
            checked={selectedItems.length === items.length}
            onChange={handleSelectAll}
          />{' '}
          전체 선택
        </div>
      </div>
      <div className="marketList">
        <div className="productList">
          {filteredItems.length > 0 ? (
            <ul className="product-grid">
              {filteredItems.map((item) => (
                <ListItem
                  key={item.id}
                  {...item}
                  isChecked={selectedItems.includes(item.id)}
                  onCheck={handleCheck}
                />
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
