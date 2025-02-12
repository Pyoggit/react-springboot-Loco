import React, { useState } from "react";
import "@/css/admin/ProductManager.css";

const ProductManager = () => {
  const [products, setProducts] = useState([
    {
      code: 101,
      seller: "홍길동",
      email: "hong@example.com",
      name: "무선 키보드",
      price: 50000,
      region: "서울",
      date: "2025-02-05",
    },
    {
      code: 102,
      seller: "이순신",
      email: "lee@example.com",
      name: "게이밍 마우스",
      price: 40000,
      region: "부산",
      date: "2025-02-06",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products.filter((product) =>
    product.name.includes(searchTerm)
  );

  return (
    <div className="admin-product-container">
      <div className="admin-product-header">
        <input
          type="text"
          placeholder="상품 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="admin-delete-btn">삭제</button>
      </div>
      <table className="admin-product-table">
        <thead>
          <tr>
            <th>상품코드</th>
            <th>판매자</th>
            <th>판매자 이메일</th>
            <th>상품명</th>
            <th>상품가격</th>
            <th>지역</th>
            <th>등록일자</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.code}>
              <td>{product.code}</td>
              <td>{product.seller}</td>
              <td>{product.email}</td>
              <td>{product.name}</td>
              <td>{product.price.toLocaleString()}원</td>
              <td>{product.region}</td>
              <td>{product.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
