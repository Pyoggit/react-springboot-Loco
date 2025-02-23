import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GoogleMap from "./GoogleMap";
import "@/css/member/market/ProductInsert.css";

const ProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "",
    price: "",
    images: [],
    address: "",
    coordinates: { lat: null, lng: null },
    placeId: "",
  });

  const [userId, setUserId] = useState(null);
  const [product, setProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /** ✅ 로그인한 사용자 정보 가져오기 */
  // useEffect(() => {
  //   const loginUser = localStorage.getItem('loginUser');

  //   if (!loginUser) {
  //     console.warn('⚠️ 로그인 정보가 없습니다. 다시 로그인 필요');
  //     navigate('/login');
  //     return;
  //   }

  //   try {
  //     const parsedUser = JSON.parse(loginUser);
  //     console.log('✅ 로그인한 사용자 정보:', parsedUser);
  //     setUserId(parsedUser.userId);
  //   } catch (error) {
  //     console.error('❌ 로그인 사용자 정보 파싱 오류:', error);
  //   }
  // }, [navigate]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.warn("⚠️ 로그인 정보가 없습니다. 다시 로그인 필요");
      navigate("/login");
      return;
    }

    try {
      const parsedId = JSON.parse(userId);
      console.log("✅ 로그인한 사용자 정보:", parsedId);
      setUserId(parsedId.userId);
    } catch (error) {
      console.error("❌ 로그인 사용자 정보 파싱 오류:", error);
    }
  }, [navigate]);

  /** ✅ 기존 상품 정보 불러오기 */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/market/info/${id}`
        );
        console.log("✅ 상품 정보:", response.data);
        setProduct(response.data.product); // ✅ 여기서 product 객체만 저장
        setFormData({
          name: response.data.product.productName,
          content: response.data.product.description,
          category: response.data.product.productCategory,
          price: response.data.product.price,
          address: response.data.product.productAddress,
          coordinates: {
            lat: response.data.product.productLat,
            lng: response.data.product.productLng,
          },
          placeId: response.data.product.productPlaceId,
        });

        setExistingImages(
          response.data.product.images.map(
            (img) => `${import.meta.env.VITE_API_URL}/upload/${img.pictureUrl}`
          )
        );
      } catch (error) {
        console.error("❌ 상품 정보를 불러오는 중 오류 발생:", error);
        alert("존재하지 않는 상품입니다.");
        navigate("/market", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    // ✅ localStorage에서 userId를 올바르게 가져오는지 확인
    const storedUserId = localStorage.getItem("userId");
    console.log("🔍 localStorage 저장된 userId:", storedUserId);

    if (storedUserId) {
      setUserId(Number(storedUserId)); // ✅ 반드시 숫자로 변환
    }
  }, []);

  /** ✅ 본인만 수정 가능하도록 체크 */
  useEffect(() => {
    if (product && userId) {
      console.log("🟢 로그인한 유저 ID:", Number(userId));
      console.log("🟢 상품 등록자 ID:", Number(product.userId));

      if (Number(product?.userId) !== Number(userId)) {
        alert("본인이 등록한 상품만 수정할 수 있습니다.");
        navigate("/market");
      }
    }
  }, [product, userId, navigate]);

  if (loading) {
    return <div>데이터 로딩중...!</div>;
  }

  /** ✅ 새로운 이미지 추가 시 기존 이미지와 병합하여 미리보기 반영 */
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setExistingImages(previewUrls); // 새 이미지 미리보기 갱신
  };

  /** ✅ 상품 수정 요청 */
  const handleUpdate = async () => {
    if (
      !formData.name ||
      !formData.content ||
      !formData.category ||
      !formData.price
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // ✅ 수정 요청 전에 accessToken 확인
    let token = localStorage.getItem("normal_accessToken"); // ✅ 올바른 토큰 키 확인
    if (!token) {
      console.error("❌ 저장된 토큰 없음! 다시 로그인 필요");
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      navigate("/login");
      return;
    }

    console.log("🟢 수정 요청 전 accessToken 확인:", token);
    console.log("🟢 로그인한 유저 ID:", userId);
    console.log("🟢 상품 등록자 ID:", product?.userId);

    if (!userId || Number(userId) !== Number(product?.userId)) {
      alert("본인이 등록한 상품만 수정할 수 있습니다.");
      return;
    }

    const formDataToSend = new FormData();

    const updatedProductData = {
      userId, // ✅ 로그인한 사용자 ID 포함
      productId: id,
      productName: formData.name,
      description: formData.content,
      productCategory: formData.category,
      price: Number(formData.price),
      productAddress: formData.address,
      productLat: formData.coordinates.lat,
      productLng: formData.coordinates.lng,
      productPlaceId: formData.placeId,
    };

    formDataToSend.append(
      "product",
      new Blob([JSON.stringify(updatedProductData)], {
        type: "application/json",
      })
    );

    newFiles.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      console.log("🔹 수정 요청 데이터:", updatedProductData);

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/market/update/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // ✅ 토큰 포함
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("상품이 성공적으로 수정되었습니다!");
        navigate(`/market/info/${id}`);
      }
    } catch (error) {
      console.error("❌ 상품 수정 실패:", error);

      // ✅ 백엔드에서 401(Unauthorized) 응답 시 로그인 필요 안내
      if (error.response?.status === 401) {
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("normal_accessToken");
        navigate("/login");
      } else {
        alert("상품 수정에 실패했습니다.");
      }
    }
  };

  return (
    <div className="product-insert">
      <h2>상품 수정</h2>
      <form className="product-input-container">
        <input
          type="text"
          name="name"
          placeholder="상품명"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <label htmlFor="fileUpload" className="file-label">
          새로운 이미지를 선택하세요 (최대 3장)
        </label>
        <input
          type="file"
          multiple
          name="images"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <div className="product-preview-container">
          {existingImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`미리보기 ${index + 1}`}
              className="product-preview-image"
            />
          ))}
        </div>
        <textarea
          name="content"
          placeholder="상품 설명"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />
        <input
          type="text"
          name="price"
          placeholder="가격"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <GoogleMap />
        <div className="product-insert-button">
          <button className="team-button" onClick={() => navigate(-1)}>
            취소하기
          </button>
          <button className="team-button" type="button" onClick={handleUpdate}>
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpdate;
