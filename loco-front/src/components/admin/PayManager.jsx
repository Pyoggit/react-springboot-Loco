import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/css/admin/PayManager.css';

const PayManager = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayments, setSelectedPayments] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ✅ 주문 목록 불러오기 (DB에서 가져오기)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payment/all-orders`
        );

        // ✅ 대문자 키 → 소문자 변환
        const mappedPayments = response.data.map((pay) => ({
          orderId: pay.ORDER_ID,
          price: pay.PRICE,
          orderDate: pay.ORDER_DATE,
          customerName: pay.CUSTOMER_NAME,
          productName: pay.PRODUCT_NAME,
          sellerName: pay.SELLER_NAME,
        }));

        setPayments(mappedPayments);
      } catch (error) {
        console.error('❌ 주문 목록 불러오기 실패:', error);
      }
    };

    fetchPayments();
  }, []);

  // ✅ 검색 필터링
  const filteredPayments = payments.filter((pay) =>
    (pay.productName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ 페이지네이션 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / itemsPerPage)
  );
  const displayedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ 개별 체크박스 클릭
  const handleCheckboxChange = (orderId) => {
    setSelectedPayments((prevSelected) => {
      const updatedSelected = new Set(prevSelected);
      if (updatedSelected.has(orderId)) {
        updatedSelected.delete(orderId);
      } else {
        updatedSelected.add(orderId);
      }
      setSelectAll(updatedSelected.size === displayedPayments.length);
      return updatedSelected;
    });
  };

  // ✅ 전체 선택/해제
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(displayedPayments.map((pay) => pay.orderId)));
    }
    setSelectAll(!selectAll);
  };

  // ✅ 선택한 주문 삭제 (API 호출)
  const handleDeleteSelected = async () => {
    if (selectedPayments.size === 0) {
      alert('삭제할 주문을 선택하세요.');
      return;
    }

    if (window.confirm('선택한 주문을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('normal_accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          return;
        }

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/payment/remove-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { orderIds: Array.from(selectedPayments) },
          }
        );

        alert('선택한 주문이 삭제되었습니다.');

        // ✅ 삭제된 주문 제외하고 목록 갱신
        setPayments((prevPayments) =>
          prevPayments.filter((pay) => !selectedPayments.has(pay.orderId))
        );
        setSelectedPayments(new Set());
        setSelectAll(false);
      } catch (error) {
        console.error('❌ 주문 삭제 실패:', error);
        alert('주문 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="admin-pay-container">
      <div className="admin-pay-header">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-pay-search-input"
        />
        <button className="admin-pay-delete-btn" onClick={handleDeleteSelected}>
          삭제
        </button>
      </div>

      <table className="admin-pay-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>주문 코드</th>
            <th>판매자</th>
            <th>구매자</th>
            <th>상품명</th>
            <th>상품가격</th>
            <th>주문 날짜</th>
          </tr>
        </thead>
        <tbody>
          {displayedPayments.map((pay, index) => (
            <tr key={pay.orderId || `order-${index}`}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPayments.has(pay.orderId)}
                  onChange={() => handleCheckboxChange(pay.orderId)}
                />
              </td>
              <td>{pay.orderId}</td>
              <td>{pay.sellerName || '판매자 없음'}</td>
              <td>{pay.customerName || '구매자 없음'}</td>
              <td>{pay.productName || '상품명 없음'}</td>
              <td>{pay.price?.toLocaleString() || '가격 정보 없음'} 원</td>
              <td>
                {pay.orderDate
                  ? new Date(pay.orderDate).toLocaleDateString()
                  : '날짜 없음'}
              </td>
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

export default PayManager;
