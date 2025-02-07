import "@/css/member/common/Circles.css";
import MapSection from "./MapSection";

const Circles = () => {
  const circles = [
    { name: "서울 등산 모임", category: "운동", image: "circle01.jpg" },
    { name: "IT 개발자 스터디", category: "스터디", image: "circle02.jpg" },
    { name: "맛집 탐방", category: "푸드", image: "circle03.jpg" },
    { name: "여행 동행 구하기", category: "여행", image: "circle04.jpg" },
    { name: "야구 직관 모임", category: "스포츠", image: "circle05.jpg" },
    { name: "독서 토론", category: "취미", image: "circle06.jpg" },
  ];

  return (
    <section className="circles-layout">
      <MapSection LATITUDE={37.5665} LONGITUDE={126.978} />

      <div className="circles-container">
        <h2 className="circles-title">최신 모임</h2>
        <div className="circles-grid">
          {circles.map((circle, index) => (
            <div key={index} className="circle-card">
              <img
                src={`src/assets/images/${circle.image}`}
                className="circle-image"
                alt={circle.name}
              />
              <h3 className="circle-name">{circle.name}</h3>
              <p className="circle-category">#{circle.category}</p>
            </div>
          ))}
        </div>
        <button className="view-more">더 보기</button>
      </div>
    </section>
  );
};

export default Circles;
