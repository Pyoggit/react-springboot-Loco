import React, { useEffect, useState } from "react";
import axios from "axios";
import "@/css/member/Circle/MypageCircle.css";

const MypageCircle = () => {
  const [userCircles, setUserCircles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchUserCircles = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("normal_accessToken");

      if (!userId || !token) {
        console.error("❌ 로그인 정보가 없습니다.");
        return;
      }

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/api/users/${userId}/attending-circles`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("✅ API 응답 데이터:", response.data);
        setUserCircles(response.data);
      } catch (error) {
        console.error("❌ 참석한 모임 목록 가져오기 실패:", error);
      }
    };

    fetchUserCircles();
  }, []);

  const totalPages = Math.max(1, Math.ceil(userCircles.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userCircles.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="mypage-circle">
      <h2>내가 참석한 모임</h2>
      {userCircles.length > 0 ? (
        <table className="circle-table">
          <thead>
            <tr>
              <th>모임방 코드</th>
              <th>모임방 제목</th>
              <th>날짜</th>
              <th>장소</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((circle, index) => (
                <tr key={circle.circleId || index}>
                  <td>{circle.circleId || "N/A"}</td>
                  <td>{circle.circleName || "N/A"}</td>
                  <td>{circle.circleDate || "N/A"}</td>
                  <td>{circle.circleAddress || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-posts">
                  참석한 모임이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className="no-posts">참석한 모임이 없습니다.</p>
      )}

      {totalPages > 1 && (
        <div className="mypage-circle-pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className="page-number">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default MypageCircle;
