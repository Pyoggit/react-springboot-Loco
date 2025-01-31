import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import "../../../css/member/common/Carousel.css";

function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    startSlider();
    return () => clearInterval(intervalRef.current); // 컴포넌트 언마운트 시 정리
  }, []);

  const startSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, 3000);
  };

  const stopSlider = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handlePrevious = () => {
    stopSlider();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? children.length - 1 : prevIndex - 1
    );
    startSlider();
  };

  const handleNext = () => {
    stopSlider();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    startSlider();
  };

  return (
    <div className="carousel-wrapper">
      <div className="carousel">
        <button className="prev" onClick={handlePrevious}>
          <FontAwesomeIcon icon={faChevronLeft} size="lg" />
        </button>

        <div className="carousel-inner">
          {children.map((child, index) => (
            <div
              key={index}
              className={index === currentIndex ? "slide active" : "slide"}
            >
              {child}
            </div>
          ))}
        </div>
        <button className="next" onClick={handleNext}>
          <FontAwesomeIcon icon={faChevronRight} size="lg" />
        </button>
      </div>
    </div>
  );
}

export default Carousel;
