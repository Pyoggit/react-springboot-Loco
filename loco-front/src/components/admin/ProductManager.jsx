import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/css/admin/ProductManager.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // ✅ 상품 목록 불러오기 (DB에서 가져오기)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error('❌ 상품 목록 불러오기 실패:', error);
      }
    };

    fetchProducts();
  }, []);

  // ✅ 상품 검색 필터링
  const filteredProducts = products
    .filter((product) =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  // ✅ 개별 체크박스 클릭 시
  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(productId)) {
        updatedSelected.delete(productId);
      } else {
        updatedSelected.add(productId);
      }
      setSelectAll(updatedSelected.size === products.length);
      return updatedSelected;
    });
  };

  // ✅ 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(
        new Set(products.map((product) => product.productId))
      );
    }
    setSelectAll(!selectAll);
  };

  // ✅ 선택한 상품 삭제 (API 호출)
  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) {
      alert('삭제할 상품을 선택하세요.');
      return;
    }

    if (window.confirm('선택한 상품을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('normal_accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/market/remove`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { productIds: Array.from(selectedProducts) },
          }
        );

        alert('선택한 상품이 삭제되었습니다.');

        // ✅ 삭제된 상품을 제외하고 목록 갱신
        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => !selectedProducts.has(product.productId)
          )
        );
        setSelectedProducts(new Set());
        setSelectAll(false);
      } catch (error) {
        console.error('❌ 상품 삭제 실패:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="admin-product-container">
      <div className="admin-product-header">
        <input
          type="text"
          placeholder="상품 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="admin-product-delete-btn"
          onClick={handleDeleteSelected}
        >
          삭제
        </button>
      </div>
      <table className="admin-product-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>상품코드</th>
            <th>판매자</th>
            <th>판매자 이메일</th>
            <th>상품명</th>
            <th>상품가격</th>
            <th>지역</th>
            <th>등록일자</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.productId}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.productId)}
                  onChange={() => handleCheckboxChange(product.productId)}
                />
              </td>
              <td>{product.productId}</td>
              <td>{product.userName}</td>
              <td>{product.userEmail}</td>
              <td>{product.productName}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{product.productAddress || '지역 정보 없음'}</td>
              <td>{new Date(product.productRegdate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span className="page-number">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ProductManager;
