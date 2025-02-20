import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/Success.css';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [productName, setProductName] = useState('상품 정보 없음'); // ✅ 상품명 추가
  const [userId, setUserId] = useState(null);
  const [customerName, setCustomerName] = useState('고객');

  const orderId = searchParams.get('orderId');
  const amount = parseInt(searchParams.get('amount'), 10);
  const paymentKey = searchParams.get('paymentKey');
  const productId = searchParams.get('productId');

  useEffect(() => {
    console.log('✅ Payment Success Page Loaded');
    console.log('✅ Received orderId:', orderId);
    console.log('✅ Received amount:', amount);
    console.log('✅ Received paymentKey:', paymentKey);
    console.log('✅ Received productId:', productId);

    if (!orderId || !amount || !paymentKey || !productId) {
      alert('결제 정보가 올바르지 않습니다.');
      navigate('/market');
      return;
    }

    const token = localStorage.getItem('normal_accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    /** ✅ 로그인한 사용자 정보 API에서 가져오기 */
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/mypage`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.userId) {
          setUserId(response.data.userId);
          setCustomerName(response.data.userName);
          console.log('✅ 로그인한 사용자 정보:', response.data);
        } else {
          console.error('❌ 사용자 정보를 가져오지 못함:', response.data);
        }
      } catch (error) {
        console.error('❌ 로그인 사용자 정보 가져오기 실패:', error);
      }
    };

    /** ✅ 결제 승인 후 주문 상태 업데이트 */
    const sendPaymentData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/payment/confirm`,
          {
            orderId,
            userId,
            productId,
            paymentMethod: '카드',
            totalAmount: amount,
            paymentKey,
            customerName, // ✅ 주문자 이름 포함
            status: 'COMPLETED',
          },
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ 인증 추가
          }
        );

        if (response.data.success) {
          console.log('✅ 결제 승인 및 저장 완료');
        } else {
          alert('결제 정보 저장 중 오류가 발생했습니다.');
          navigate('/market');
        }
      } catch (error) {
        console.error('❌ 결제 정보 저장 실패:', error);
        alert('결제 처리 중 문제가 발생했습니다.');
        navigate('/market');
      }
    };

    /** ✅ 결제 정보 저장 후 상품명 가져오기 */
    const fetchProductName = async () => {
      try {
        const numericProductId = Number(productId);
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/market/product-name/${numericProductId}`
        );
        setProductName(response.data);
        console.log('✅ 상품명 조회 성공:', response.data);
      } catch (error) {
        console.error('❌ 상품명 조회 실패:', error);
      }
    };

    /** ✅ 순서: 사용자 정보 가져오기 → 결제 승인 → 상품명 조회 */
    const processPaymentSuccess = async () => {
      await fetchUserInfo(); // ✅ 로그인한 사용자 정보 가져오기
      await sendPaymentData(); // ✅ 결제 정보 저장 완료!
      await fetchProductName(); // ✅ 결제 정보 저장 후 상품명 조회
      setIsLoading(false);
    };

    processPaymentSuccess();
  }, [orderId, amount, paymentKey, productId, navigate]);

  return (
    <div className="success-container">
      {isLoading ? (
        <div className="loading-message">결제 정보를 저장하는 중...</div>
      ) : (
        <>
          <div className="success-icon">🎉</div>
          <h1 className="success-title">결제 성공!</h1>
          <div className="success-content">
            <p>
              <strong>주문 아이디:</strong> {orderId}
            </p>
            <p>
              <strong>주문자:</strong> {customerName}
            </p>
            <p>
              <strong>상품명:</strong> {productName}
            </p>
            <p>
              <strong>결제 금액:</strong> {amount.toLocaleString()}원
            </p>
          </div>
          <button
            className="success-button"
            onClick={() => (window.location.href = '/')}
          >
            홈으로 돌아가기
          </button>
        </>
      )}
    </div>
  );
}
