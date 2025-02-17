import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/Success.css';

export function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get('orderId');
  const amount = parseInt(searchParams.get('amount'), 10); // ✅ 숫자로 변환
  const paymentKey = searchParams.get('paymentKey');
  const productId = searchParams.get('productId');

  // ✅ 로그인한 사용자 정보 가져오기
  const loginUser = localStorage.getItem('loginUser');
  let userId = null;
  let customerName = '테스트 사용자'; // 기본값 설정

  if (loginUser) {
    try {
      const parsedUser = JSON.parse(loginUser);
      userId = parsedUser.userId;
      customerName = parsedUser.userName;
    } catch (error) {
      console.error('❌ 로그인 사용자 정보 파싱 오류:', error);
    }
  }

  useEffect(() => {
    console.log('✅ Payment Success Page Loaded');
    console.log('✅ Received orderId:', orderId);
    console.log('✅ Received amount:', amount);
    console.log('✅ Received paymentKey:', paymentKey);
    console.log('✅ Received productId:', productId);
    console.log('✅ Received customerName:', customerName);

    if (!orderId || !amount || !paymentKey || !productId || !userId) {
      alert('결제 정보가 올바르지 않습니다.');
      navigate('/market');
      return;
    }

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
          }
        );

        if (response.data.success) {
          setIsLoading(false);
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

    sendPaymentData();
  }, [orderId, amount, paymentKey, productId, customerName, navigate]);

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
