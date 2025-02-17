import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '@/css/member/market/ProductInfo.css';
import Payment from './Payment';
import GoogleMap from './GoogleMap';

const ProductInfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [sellerName, setSellerName] = useState(''); // ✅ 판매자 이름 추가
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userId, setUserId] = useState(null); // ✅ 로그인한 사용자 ID 저장

  /** ✅ 로그인한 사용자 정보 가져오기 */
  useEffect(() => {
    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
      try {
        const parsedUser = JSON.parse(loginUser);
        console.log('✅ 로그인한 사용자 정보:', parsedUser);
        setUserId(parsedUser.userId);
      } catch (error) {
        console.error('❌ 로그인 사용자 정보 파싱 오류:', error);
      }
    }
  }, []);

  /** ✅ 상품 정보 가져오기 (판매자 이름 포함) */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/info/${id}`
        );
        console.log('✅ 상품 정보:', response.data);

        setProduct(response.data.product);
        setSellerName(response.data.sellerName || '알 수 없음'); // ✅ 판매자 이름 저장
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
    userId !== null &&
    product.userId !== null &&
    Number(userId) === Number(product.userId);
  console.log(
    '🔍 로그인한 userId:',
    userId,
    '상품 등록 userId:',
    product.userId
  );
  console.log('✅ isOwner:', isOwner);

  // 이미지 URL 설정 (기본 썸네일 포함)
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
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/market/remove`,
          {
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
          <p className="product-info-seller">판매자: {sellerName}</p>{' '}
          {/* ✅ 판매자 이름 추가 */}
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

          {/* ✅ 본인이 등록한 상품일 경우에만 수정 및 삭제 버튼 표시 */}
          {isOwner ? (
            <>
              <button
                className="team-button"
                onClick={() => navigate(`/market/update/${product.productId}`)}
              >
                수정하기
              </button>
              <button className="team-button delete" onClick={handleDelete}>
                삭제하기
              </button>
            </>
          ) : (
            <Payment
              amount={product.price}
              orderName={product.productName}
              productId={product.productId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
