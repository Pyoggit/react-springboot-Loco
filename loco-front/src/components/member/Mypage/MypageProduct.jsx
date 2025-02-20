import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/mypage/MypageProduct.css';

const MypageProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userId, setUserId] = useState(null);

  /** ✅ 로그인한 사용자 정보 가져오기 */
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('normal_accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/mypage`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.userId) {
          setUserId(response.data.userId);
          console.log('✅ 로그인한 사용자 ID:', response.data.userId);
        } else {
          console.error('❌ 사용자 정보를 가져오지 못함:', response.data);
        }
      } catch (error) {
        console.error('❌ 로그인 사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  /** ✅ 내가 등록한 상품 목록 가져오기 */
  useEffect(() => {
    const fetchProducts = async () => {
      if (!userId) return;

      const token = localStorage.getItem('normal_accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/my-products`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('📌 불러온 상품 목록:', response.data);
        setProducts(response.data || []);
      } catch (error) {
        console.error('❌ 상품 목록 불러오기 실패:', error);
        if (error.response?.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('normal_accessToken');
          navigate('/login');
        }
      }
    };

    fetchProducts();
  }, [userId, navigate]);

  /** ✅ 검색 필터 적용 */
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.productName.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [search, products]);

  /** ✅ 페이지네이션 적용 */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  /** ✅ 상품 삭제 */
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('정말로 삭제하시겠습니까?')) return;

    const token = localStorage.getItem('normal_accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/market/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productIds: [productId] },
      });

      alert('상품이 삭제되었습니다.');
      setProducts(
        products.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error('❌ 상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="mypage-product-container">
      <h2>내가 등록한 상품</h2>

      <div className="mypage-product-header">
        <input
          type="text"
          className="mypage-product-search-input"
          placeholder="상품명을 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="mypage-product-table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>카테고리</th>
            <th>가격</th>
            <th>등록 날짜</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((product) => (
              <tr key={product.productId}>
                <td>{product.productName}</td>
                <td>{product.productCategory}</td>
                <td>{product.price?.toLocaleString() ?? '0'}원</td>
                <td>
                  {product.productRegdate
                    ? new Date(product.productRegdate).toLocaleDateString()
                    : '날짜 없음'}
                </td>

                <td>
                  <button
                    className="mypage-edit-btn"
                    onClick={() =>
                      navigate(`/market/update/${product.productId}`)
                    }
                  >
                    수정
                  </button>
                  <button
                    className="mypage-delete-btn"
                    onClick={() => handleDeleteProduct(product.productId)}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">등록한 상품이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="mypage-product-pagination">
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
            currentPage === Math.ceil(filteredProducts.length / itemsPerPage)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageProduct;
