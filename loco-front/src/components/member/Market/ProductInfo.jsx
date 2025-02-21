import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/ProductInfo.css';
import Payment from './Payment';
import GoogleMap from './GoogleMap';
import { ChatContext } from '@/utils/ChatContext';

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const { setActiveRoomId } = useContext(ChatContext);

  /** ✅ 로그인한 사용자 정보 가져오기 */
  useEffect(() => {
    const accessToken = localStorage.getItem('normal_accessToken');
    if (!accessToken) {
      console.warn('⚠️ 로그인 토큰 없음 → 사용자 정보 가져오지 않음.');
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/mypage`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        console.log('✅ 로그인한 사용자 정보:', response.data);
        setUserId(response.data.userId);
      })
      .catch((error) => {
        console.error('❌ 로그인 사용자 정보 불러오기 실패:', error);
      });
  }, []);

  /** ✅ 상품 정보 가져오기 */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/info/${id}`
        );
        console.log('✅ 상품 정보:', response.data);

        setProduct(response.data.product);
        setSellerName(response.data.sellerName || '알 수 없음');
      } catch (error) {
        console.error('❌ 상품 정보를 불러오는 중 오류 발생:', error);
        alert('존재하지 않는 상품입니다.');
        navigate('/market', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return <div>데이터 로딩중...!</div>;
  }

  if (!product) {
    return <div>상품 정보를 불러올 수 없습니다.</div>;
  }

  // ✅ 상품 등록자와 로그인한 사용자가 같은지 확인
  const isOwner =
    userId && product.userId && Number(userId) === Number(product.userId);
  console.log(
    '🔍 로그인한 userId:',
    userId,
    '상품 등록 userId:',
    product.userId
  );
  console.log('✅ isOwner:', isOwner);

  // 이미지 URL 설정
  const images =
    product.images && product.images.length > 0
      ? product.images.map(
          (img) => `${import.meta.env.VITE_API_URL}/upload/${img.pictureUrl}`
        )
      : ['/default-placeholder.png'];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  /** ✅ 상품 삭제 버튼 클릭 시 */
  const handleDelete = async () => {
    if (!isOwner) {
      alert('본인이 등록한 상품만 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('normal_accessToken');
        if (!token) {
          alert('로그인이 필요합니다.');
          navigate('/login');
          return;
        }

        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/market/remove`,
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { productIds: [product.productId] },
          }
        );

        alert('상품이 삭제되었습니다.');
        navigate('/market');
      } catch (error) {
        console.error('❌ 상품 삭제 실패:', error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  /** ✅ 판매자와 채팅 시작 */
  const startChatWithSeller = async () => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    const accessToken = localStorage.getItem('normal_accessToken');
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }
    console.log('채팅방 생성 요청:', {
      sellerId: product.userId,
      buyerId: userId,
      productId: product.productId,
    });
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chat/room`,
        {
          sellerId: product.userId,
          buyerId: userId,
          productId: product.productId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('채팅방 생성 성공:', response.data);
      setActiveRoomId(response.data.roomId);
      alert(
        '채팅방이 생성되었습니다. 헤더의 채팅 아이콘을 눌러 채팅창을 열어주세요.'
      );
    } catch (error) {
      console.error('채팅방 생성 실패:', error.response?.data || error);
      alert('채팅방을 생성할 수 없습니다.');
    }
  };

  return (
    <div className="product-info">
      <div className="product-info-view">
        <div className="product-info-image-slider">
          <button className="slider-button prev" onClick={handlePrevImage}>
            ◀
          </button>
          <img
            src={images[currentImageIndex]}
            alt="상품 이미지"
            className="product-info-image"
          />
          <button className="slider-button next" onClick={handleNextImage}>
            ▶
          </button>
        </div>

        <div className="product-info-details">
          <h2>{product.productName}</h2>
          <p className="product-info-category">{product.productCategory}</p>
          <p className="product-info-description">{product.description}</p>
          <p className="product-info-price">
            {product.price.toLocaleString()}원
          </p>
          <p className="product-info-seller">판매자: {sellerName}</p>

          <div className="product-info-map-container">
            <p className="product-info-location">
              거래 장소: {product.productAddress || '위치 정보 없음'}
            </p>
            <GoogleMap lat={product.productLat} lng={product.productLng} />
          </div>
        </div>

        <div className="product-info-buttons">
          <button className="team-button" onClick={() => navigate(-1)}>
            뒤로가기
          </button>

          {isOwner ? (
            <>
              <button
                className="team-button"
                onClick={() => navigate(`/market/update/${product.productId}`)}
              >
                수정하기
              </button>
              <button className="team-button" onClick={handleDelete}>
                삭제하기
              </button>
            </>
          ) : (
            <>
              <button className="team-button" onClick={startChatWithSeller}>
                채팅하기
              </button>
              <Payment
                amount={product.price}
                productId={product.productId}
                orderName={product.productName}
                sellerName={sellerName}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
