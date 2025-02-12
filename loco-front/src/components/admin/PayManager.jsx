import React, { useState } from "react";
import "@/css/admin/PayManager.css";

const PayManager = () => {
  const [payments, setPayments] = useState([
    {
      code: 701,
      seller: "seller01",
      buyer: "buyer01",
      product: "스마트폰",
      price: 900000,
      date: "2025-02-10",
    },
    {
      code: 702,
      seller: "seller02",
      buyer: "buyer02",
      product: "노트북",
      price: 1500000,
      date: "2025-02-09",
    },
    {
      code: 703,
      seller: "seller03",
      buyer: "buyer03",
      product: "태블릿",
      price: 600000,
      date: "2025-02-08",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredPayments = payments
    .filter((pay) =>
      pay.product.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="admin-pay-container">
      <div className="admin-pay-header">
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-pay-search-input"
        />
      </div>

      <table className="admin-pay-table">
        <thead>
          <tr>
            <th>결제 코드</th>
            <th>판매자 아이디</th>
            <th>구매자 아이디</th>
            <th>상품명</th>
            <th>상품가격</th>
            <th>결제일자</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((pay) => (
            <tr key={pay.code}>
              <td>{pay.code}</td>
              <td>{pay.seller}</td>
              <td>{pay.buyer}</td>
              <td>{pay.product}</td>
              <td>{pay.price.toLocaleString()}원</td>
              <td>{pay.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default PayManager;
