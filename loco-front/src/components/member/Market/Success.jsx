import { useSearchParams } from 'react-router-dom';
import '@/css/member/market/Success.css';

export function SuccessPage() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
  const amount = Number(searchParams.get('amount')).toLocaleString();

  return (
    <div className="success-container">
      <div className="success-icon">🎉</div>
      <h1 className="success-title">결제 성공!</h1>
      <div className="success-content">
        <p>
          <strong>주문 아이디:</strong> {orderId}
        </p>
        <p>
          <strong>결제 금액:</strong> {amount}원
        </p>
      </div>
      <button
        className="success-button"
        onClick={() => (window.location.href = '/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
