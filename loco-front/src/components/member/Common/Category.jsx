import React from "react";
import "@/css/member/common/Category.css";

const Category = () => {
  const categories = [
    "전체",
    "친목",
    "스터디",
    "취미",
    "푸드/드링크",
    "스포츠",
    "여행/동행",
  ];

  return (
    <section className="main-category">
      <h2>모임을 탐방하세요</h2>
      <div className="main-category-container">
        {categories.map((category, index) => (
          <span key={index} className="main-category-item">
            {category}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Category;
