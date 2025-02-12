import React, { useState } from "react";
import "@/css/admin/CircleManager.css";

const CircleManager = () => {
  const [circles, setCircles] = useState([
    {
      code: 301,
      creator: "이민호",
      email: "minho@example.com",
      title: "등산 모임",
      region: "서울",
      date: "2025-02-05",
    },
  ]);

  return (
    <div className="admin-circle-container">
      <table className="admin-circle-table">
        <thead>
          <tr>
            <th>모임방 코드</th>
            <th>개설자</th>
            <th>이메일</th>
            <th>모임방 제목</th>
            <th>지역</th>
            <th>개설일자</th>
          </tr>
        </thead>
        <tbody>
          {circles.map((circle) => (
            <tr key={circle.code}>
              <td>{circle.code}</td>
              <td>{circle.creator}</td>
              <td>{circle.email}</td>
              <td>{circle.title}</td>
              <td>{circle.region}</td>
              <td>{circle.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CircleManager;
