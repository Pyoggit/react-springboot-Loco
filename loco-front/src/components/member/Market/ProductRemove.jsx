import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/ProductRemove.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

const ListItem = ({
  productId,
  productName,
  images,
  productCategory,
  price,
  isChecked,
  onCheck,
}) => {
  const navigate = useNavigate();

  // 썸네일 이미지 URL 생성
  const thumbnail =
    images && images.length > 0
      ? `${import.meta.env.VITE_API_URL}/upload/${images[0].pictureUrl}`
      : '/default-placeholder.png';

  return (
    <div className="productList-Item">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onCheck(productId)}
        className="product-checkbox"
      />
      <div className="product-list">
        <img src={thumbnail} alt={productName} className="product-image" />
        <div className="product-info">
          <p className="product-name">상품명: {productName}</p>
          <p className="product-category">카테고리: {productCategory}</p>
          <p className="product-price">가격: {price.toLocaleString()}원</p>
          <div className="product-item-button">
            <button
              onClick={() => navigate(`/market/info/${productId}`)}
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
  const [items, setItems] = useState([]);

  const categories = [
    '전체',
    '스포츠용품',
    '도서',
    '의류',
    '필기도구',
    '여행용품',
    '전자제품',
  ];

  // ✅ 내 상품 목록 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/my-products`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(response.data);
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
      }
    };
    fetchProducts();
  }, []);

  // ✅ 개별 상품 선택/해제
  const handleCheck = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // ✅ 선택된 상품 삭제
  const handleRemoveSelected = async () => {
    if (selectedItems.length === 0) {
      alert('삭제할 상품을 선택해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/market/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productIds: selectedItems },
      });

      // 삭제 후 리스트 갱신
      setItems(items.filter((item) => !selectedItems.includes(item.productId)));
      setSelectedItems([]);
      alert('선택한 상품이 삭제되었습니다.');
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제 중 오류가 발생했습니다.');
    }
  };

  // ✅ 전체 선택/해제
  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === items.length
        ? []
        : items.map((item) => item.productId)
    );
  };

  // ✅ 검색 및 카테고리 필터링 적용
  const filteredItems = items.filter((item) => {
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
                  key={item.productId}
                  {...item}
                  isChecked={selectedItems.includes(item.productId)}
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
