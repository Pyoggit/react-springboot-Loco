import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/ProductPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
//import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';

const ListItem = ({
  productId,
  productName,
  images,
  productCategory,
  price,
  userName,
  status,
}) => {
  const navigate = useNavigate();
  //const [isLikeClick, setIsLikeClick] = useState(false);

  // ✅ 상품이 판매 완료 상태라면 클릭 이벤트 방지
  const handleDetailClick = (e) => {
    if (status === 'SOLD_OUT') return;
    e.stopPropagation();
    navigate(`/market/info/${productId}`);
  };

  // ✅ 상품 상태에 따라 클래스 지정
  const statusClass = status === 'SOLD_OUT' ? 'sold-out' : 'available';

  // 백엔드에서 저장된 파일명(pictureUrl)만 받아오므로, 정적 리소스 매핑 경로와 결합합니다.
  const thumbnail =
    images && images.length > 0
      ? `${import.meta.env.VITE_API_URL}/upload/${images[0].pictureUrl}`
      : '/default-placeholder.png';

  return (
    <div className={`product-List-Item ${statusClass}`}>
      {status === 'SOLD_OUT' && (
        <div className="sold-out-overlay">판매 완료</div>
      )}
      {/* <div className="like-button">
        <button
          className="like-button"
          onClick={() => {
            setIsLikeClick((prev) => {
              const newState = !prev;
              alert(
                newState
                  ? '좋아요를 눌렀습니다! 💖'
                  : '좋아요를 취소했습니다. 💔'
              );
              return newState;
            });
          }}
        >
          <FontAwesomeIcon
            icon={isLikeClick ? solidHeart : regularHeart}
            className="like-icon"
          />
        </button>
      </div> */}
      <div className="product-list">
        <img
          src={thumbnail}
          alt={productName}
          className="productPage-image"
          onClick={handleDetailClick}
        />
        <div className="productPage-info">
          <p className="productPage-name">상품명: {productName}</p>
          <p className="productPage-category">카테고리: {productCategory}</p>
          <p className="productPage-price">가격: {price.toLocaleString()}원</p>
          <p className="productPage-seller">
            판매자: {userName || '알 수 없음'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const [search, setSearch] = useState('');
  const [searchOpt, setSearchOpt] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const categories = [
    '전체',
    '스포츠용품',
    '도서',
    '의류',
    '필기도구',
    '여행용품',
    '전자제품',
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/products`
        );
        console.log('✅ 상품 데이터 응답:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('상품 목록 조회 실패:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((item) => {
      const matchesCategory =
        selectedCategory === '전체' ||
        item.productCategory === selectedCategory;
      const matchesSearch =
        searchOpt === 'name'
          ? item.productName.toLowerCase().includes(search.toLowerCase())
          : item.productCategory.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [search, selectedCategory, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div className="productPage">
      <div className="productPage-topBar">
        <div className="product-searchBar">
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
      <div className="marketList">
        <div className="productList">
          {currentItems.length > 0 ? (
            <ul className="product-grid">
              {currentItems.map((item) => (
                <li key={item.productId}>
                  <ListItem {...item} userName={item.userName} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="productPage-default-message">결과가 없습니다.</p>
          )}
        </div>
      </div>
      <div className="productPage-pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="page-number">
          {currentPage} / {Math.ceil(filteredProducts.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredProducts.length / itemsPerPage)
              )
            )
          }
          disabled={
            currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
}
