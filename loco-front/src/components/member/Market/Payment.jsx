import React, { useEffect, useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import axios from 'axios';

const Payment = ({ amount, orderName, productId, sellerName }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('고객');
  const paymentMethod = '카드';

  // ✅ API를 통해 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('normal_accessToken');
      if (!token) {
        console.warn('⚠️ 로그인 토큰 없음 → 사용자 정보 가져오지 않음.');
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/mypage`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.userId) {
          setUserId(response.data.userId);
          setUserName(response.data.userName);
          console.log('✅ 로그인한 사용자 정보:', response.data);
        } else {
          console.error('❌ 사용자 정보를 가져오지 못함:', response.data);
        }
      } catch (error) {
        console.error('❌ 로그인 사용자 정보 가져오기 실패:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const initPayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        'test_ck_ORzdMaqN3wnppavR15Ab85AkYXQG'
      );

      if (!userId) {
        alert('로그인이 필요합니다.');
        return;
      }

      if (!productId) {
        alert('상품 정보가 없습니다. 다시 시도해주세요.');
        return;
      }

      const token = localStorage.getItem('normal_accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      // ✅ 서버에 정확한 사용자 정보를 전달
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/create-order`,
        {
          userId: userId,
          customerName: userName,
          sellerName: sellerName,
          productId: productId,
          productName: orderName,
          totalAmount: amount,
          paymentMethod: paymentMethod,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { success, orderId, message } = orderResponse.data;

      if (!success || !orderId) {
        alert(message || '주문 생성 중 오류가 발생했습니다.');
        return;
      }

      console.log('✅ 생성된 Order ID:', orderId);

      // ✅ Toss Payments 결제 요청
      tossPayments
        .requestPayment(paymentMethod, {
          amount: amount,
          orderId: orderId,
          orderName: orderName,
          successUrl: `${window.location.origin}/market/payment-success?orderId=${orderId}&amount=${amount}&productId=${productId}`,
          failUrl: `${window.location.origin}/market/payment-fail?orderId=${orderId}`,
        })
        .catch((error) => {
          console.error('❌ Toss 결제 창 오류:', error);
          alert('결제 요청 중 문제가 발생했습니다. 다시 시도해주세요.');
        });
    } catch (error) {
      console.error('❌ 결제 요청 중 오류 발생:', error);
      alert('결제 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <button onClick={initPayment} className="team-button">
      결제하기
    </button>
  );
};

export default Payment;
