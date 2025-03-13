import React, { useEffect } from "react";
import "@/css/member/common/Category.css";

const Category = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    "전체",
    "친목",
    "스터디",
    "취미",
    "푸드/드링크",
    "스포츠",
    "여행/동행",
  ];

  useEffect(() => {
    console.log("📌 선택된 카테고리:", selectedCategory);
  }, [selectedCategory]);

  return (
    <section className="main-category">
      <h2>모임을 탐방하세요</h2>
      <div className="main-category-container">
        {categories.map((category, index) => (
          <span
            key={index}
            className={`main-category-item ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Category;
