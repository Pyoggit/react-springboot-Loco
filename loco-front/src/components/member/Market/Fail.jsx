import { useSearchParams } from 'react-router-dom';
import '@/css/member/market/Fail.css';

export function FailPage() {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId') || '알 수 없음';
  const errorCode = searchParams.get('code') || 'UNKNOWN_ERROR';
  const errorMessage =
    searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';

  return (
    <div className="fail-container">
      <div className="fail-icon">❌</div>
      <h1 className="fail-title">결제 실패</h1>
      <div className="fail-content">
        <p>
          <strong>주문 아이디:</strong> {orderId}
        </p>
        <p>
          <strong>오류 코드:</strong> {errorCode}
        </p>
        <p>
          <strong>오류 메시지:</strong> {errorMessage}
        </p>
      </div>
      <button
        className="fail-button"
        onClick={() => (window.location.href = '/')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
