import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/member/common/Circles.css";

const Circles = ({ selectedCategory }) => {
  const [circles, setCircles] = useState([]);
  const navigate = useNavigate();
  const [visibleCircles, setVisibleCircles] = useState(6);

  useEffect(() => {
    if (selectedCategory) {
      fetchCircles();
    }
  }, [selectedCategory]);

  const fetchCircles = async () => {
    try {
      const response = await axios.get("/api/circles/category", {
        params: {
          category: selectedCategory === "전체" ? "" : selectedCategory,
        },
      });

      console.log("📥 서버 응답 데이터:", response.data); // ✅ 디버깅용 로그
      setCircles(response.data);
    } catch (error) {
      console.error("❌ 모임 데이터 불러오기 실패:", error);
    }
  };

  const handleViewMore = () => {
    setVisibleCircles((prev) => prev + 6);
  };

  const handleCircleClick = (circle) => {
    localStorage.setItem("selectedPost", JSON.stringify(circle)); // ✅ 선택한 모임 저장
    navigate(`/circle/detail/${circle.circleId}`);
  };

  return (
    <section className="circles-layout">
      <div className="circles-container">
        <h2 className="circles-title">
          {selectedCategory === "전체"
            ? "전체 모임"
            : `${selectedCategory} 모임`}
        </h2>
        <div className="circles-grid">
          {circles.slice(0, visibleCircles).map((circle) => (
            <div
              key={circle.circleId}
              className="circle-card"
              onClick={() => handleCircleClick(circle)} // ✅ 수정된 클릭 이벤트
            >
              <img
                src={
                  circle.pictureUrl
                    ? `${import.meta.env.VITE_API_URL}${circle.pictureUrl}`
                    : "/images/default-image.png"
                }
                className="circle-image"
                alt={circle.circleName}
              />
              <h3 className="circle-name">{circle.circleName}</h3>
              <p className="circle-category">#{circle.circleCategory}</p>
            </div>
          ))}
        </div>

        {visibleCircles < circles.length && (
          <button className="view-more" onClick={handleViewMore}>
            더 보기
          </button>
        )}
      </div>
    </section>
  );
};

export default Circles;
