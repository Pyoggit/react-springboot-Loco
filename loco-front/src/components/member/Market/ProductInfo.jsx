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
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/info/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error('상품 정보를 불러오는 중 오류 발생:', error);
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

          {/* ✅ 구글맵 위에 장소명 추가 */}
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
          <button
            className="team-button"
            onClick={() => navigate(`/market/update/${product.productId}`)}
          >
            수정하기
          </button>
          <Payment amount={product.price} orderName={product.productName} />
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
