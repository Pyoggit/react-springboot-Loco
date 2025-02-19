import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/mypage/MypageOrder.css';

const MypageOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [userId, setUserId] = useState(null);

  /** ✅ 로그인한 사용자 정보 가져오기 */
  useEffect(() => {
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
      try {
        const parsedUser = JSON.parse(loginUser);
        setUserId(parsedUser.userId);
      } catch (error) {
        console.error('❌ 로그인 사용자 정보 파싱 오류:', error);
      }
    }
  }, []);

  /** ✅ 내 결제 내역 가져오기 */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;

      const token = localStorage.getItem('normal_accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/my-orders`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrders(response.data || []);
      } catch (error) {
        console.error('❌ 결제 내역 불러오기 실패:', error);
        if (error.response?.status === 401) {
          alert('세션이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('normal_accessToken');
          navigate('/login');
        }
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  /** ✅ 상품 ID를 기반으로 상품명 조회 */
  const fetchProductNames = async (productIds) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/market/products-by-ids`,
        { productIds }
      );

      const nameMap = {};
      response.data.forEach((product) => {
        nameMap[product.productId] = product.productName; // ✅ 상품 ID -> 상품명 매칭
      });

      setProductNames(nameMap);
    } catch (error) {
      console.error('❌ 상품 정보 조회 실패:', error);
    }
  };

  /** ✅ 검색 필터 적용 */
  useEffect(() => {
    const filtered = orders.filter((order) =>
      (productNames[order.productId] ?? '상품 정보 없음')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
  }, [search, orders, productNames]);

  /** ✅ 페이지네이션 적용 */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="mypage-order-container">
      <h2>내 결제 내역</h2>

      <div className="mypage-order-header">
        <input
          type="text"
          className="mypage-order-search-input"
          placeholder="상품명을 검색하세요"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="mypage-order-table">
        <thead>
          <tr>
            <th>주문 번호</th>
            <th>상품명</th>
            <th>결제 금액</th>
            <th>결제 방법</th>
            <th>결제 상태</th>
            <th>주문 날짜</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((order) => (
              <tr key={order.orderId}>
                <td>{order.orderId}</td>
                <td>{order.productName ?? '상품 정보 없음'}</td>
                <td>{order.totalAmount?.toLocaleString() ?? '0'}원</td>
                <td>{order.paymentMethod ?? '정보 없음'}</td>
                <td>
                  {order.status === 'COMPLETED' ? '결제 완료' : '진행 중'}
                </td>
                <td>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : '날짜 없음'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">결제 내역이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>
          {currentPage} / {Math.ceil(filteredOrders.length / itemsPerPage)}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(filteredOrders.length / itemsPerPage)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(filteredOrders.length / itemsPerPage)
          }
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default MypageOrder;
