import React, { useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "@/css/admin/StatDashboard.css";

Chart.register(...registerables);

const StatDashboard = () => {
  const [stats] = useState({
    totalUsers: 1240,
    newUsers: 50,
    totalProducts: 320,
    totalSales: 1234000,
    monthlyNewUsers: [10, 15, 20, 25, 40, 35, 50, 60, 55, 70, 65, 80],
    userRegions: {
      labels: ["서울", "부산", "대구", "대전", "광주", "인천"],
      values: [400, 300, 150, 120, 100, 170],
    },
    genderRatio: {
      labels: ["남성", "여성"],
      values: [600, 640],
    },
    monthlySales: [
      100000, 120000, 150000, 130000, 180000, 200000, 170000, 160000, 140000,
      190000, 210000, 220000,
    ],
  });

  return (
    <div className="admin-stats-container">
      <div className="admin-stat-row">
        <div className="admin-stat-card">
          <h4>총 가입자 수</h4>
          <p>{stats.totalUsers} 명</p>
        </div>
        <div className="admin-stat-card">
          <h4>이번달 신규 가입자</h4>
          <p>{stats.newUsers} 명</p>
        </div>
        <div className="admin-stat-card">
          <h4>등록된 상품 수</h4>
          <p>{stats.totalProducts} 개</p>
        </div>
        <div className="admin-stat-card">
          <h4>총 매출</h4>
          <p>{stats.totalSales.toLocaleString()} 원</p>
        </div>
      </div>

      <div className="admin-chart-row">
        <div className="admin-chart-container">
          <h5>월별 신규 가입자</h5>
          <Line
            data={{
              labels: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
              ],
              datasets: [
                {
                  label: "신규 가입자 수",
                  data: stats.monthlyNewUsers,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="admin-chart-container">
          <h5>지역별 가입자 수</h5>
          <Pie
            data={{
              labels: stats.userRegions.labels,
              datasets: [
                {
                  label: "가입자 수",
                  data: stats.userRegions.values,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                  ],
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>

      <div className="admin-chart-row">
        <div className="admin-chart-container">
          <h5>성별 가입자 비율</h5>
          <Pie
            data={{
              labels: stats.genderRatio.labels,
              datasets: [
                {
                  label: "가입자 수",
                  data: stats.genderRatio.values,
                  backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                  ],
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>

        <div className="admin-chart-container">
          <h5>월별 매출</h5>
          <Bar
            data={{
              labels: [
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
              ],
              datasets: [
                {
                  label: "매출 (원)",
                  data: stats.monthlySales,
                  backgroundColor: "rgba(255, 206, 86, 0.6)",
                  borderColor: "rgba(255, 206, 86, 1)",
                  borderWidth: 2,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatDashboard;
