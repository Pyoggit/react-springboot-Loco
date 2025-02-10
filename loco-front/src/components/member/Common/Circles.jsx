import '@/css/member/common/Circles.css';
import GoogleMap from '../Circle/GoogleMap';
import circle01 from '@/assets/images/circle01.jpg';
import circle02 from '@/assets/images/circle02.jpg';
import circle03 from '@/assets/images/circle03.jpg';
import circle04 from '@/assets/images/circle04.jpg';
import circle05 from '@/assets/images/circle05.jpg';
import circle06 from '@/assets/images/circle06.jpg';

const circles = [
  { name: 'IT 개발자 스터디', category: '스터디', image: circle01 },
  { name: '독서 토론', category: '취미', image: circle02 },
  { name: '친목 모임', category: '친목', image: circle03 },
  { name: '헬스 모임', category: '스포츠', image: circle04 },
  { name: '맛집 탐방', category: '푸드/드링크', image: circle05 },
  { name: '여행 동행 구하기', category: '여행/동행', image: circle06 },
];

const Circles = () => {
  return (
    <section className="circles-layout">
      <GoogleMap />

      <div className="circles-container">
        <h2 className="circles-title">전체 모임</h2>
        <div className="circles-grid">
          {circles.map((circle, index) => (
            <div key={index} className="circle-card">
              <img
                src={circle.image}
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
