import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faFileAlt,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import "@/css/member/common/ServicePage.css";

const ServicePage = () => {
  return (
    <div className="service-wrapper">
      <div className="service-container">
        <div className="service-item">
          <FontAwesomeIcon icon={faPhone} className="service-icon phone-icon" />
          <h3 className="service-title">고객센터</h3>
          <p className="service-number"> 010 - 4192 - 7662 </p>
          <p className="service-hours">업무시간 평일 10:00 - 17:00</p>
          <p className="service-hours">점심시간 12:30 - 13:30</p>
          <p className="service-note">(주말 및 공휴일 휴무)</p>
        </div>

        <div className="service-item">
          <FontAwesomeIcon icon={faFileAlt} className="service-icon" />
          <h3 className="service-title">1:1 게시판 문의</h3>
          <p className="service-description">
            업무시간 외에 문의하신 내용은 업무시간 내에 답변 가능합니다.
          </p>
          <p className="service-description">
            하단 버튼을 통해 답변 확인이 가능합니다.
          </p>
          <Link to="/board/qna" className="service-button">
            글 쓰기
          </Link>
        </div>

        <div className="service-item">
          <FontAwesomeIcon
            icon={faComments}
            className="service-icon talk-icon"
          />
          <h3 className="service-title">카카오톡 채팅 상담 서비스</h3>
          <p className="service-description">
            사이트 우측 하단에 카카오 버튼으로 상담 가능하며,
          </p>
          <p className="service-description">
            업무시간 내에 가장 빠른 답변을 받아보실 수 있습니다.
          </p>
          <Link to="/service/chat" className="service-button">
            카카오톡 상담
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
