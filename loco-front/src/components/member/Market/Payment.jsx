import React from 'react';
import { useEffect } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

const Payment = ({ amount, orderName }) => {
  const initPayment = async () => {
    try {
      const tossPayments = await loadTossPayments(
        'test_ck_ORzdMaqN3wnppavR15Ab85AkYXQG'
      );
      const orderId = 'ORDER_123456789';

      tossPayments.requestPayment('카드', {
        amount: amount,
        orderId: orderId,
        orderName: orderName,
        customerName: '권민성',
        successUrl: `${window.location.origin}/market/payment-success?orderId=${orderId}&amount=${amount}`,
        failUrl: `${window.location.origin}/market/payment-fail?orderId=${orderId}&amount=${amount}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={initPayment} className="team-button">
      결제하기
    </button>
  );
};

export default Payment;
