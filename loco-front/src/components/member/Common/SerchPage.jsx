import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CircleListDetail from "@/components/member/circle/CircleListDetail";
import { areaData } from "@/utils/areaData";
import "@/css/member/common/searchPage.css";

function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const initialSearchTerm = queryParams.get("query") || "";
  const initialCategory = queryParams.get("category") || "";

  const [filters, setFilters] = useState({
    clubTitle: initialSearchTerm,
    city: "",
    district: "",
    category: initialCategory,
    startDate: "",
  });

  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setIsLoading(true);

      // ✅ 제목이 비어있으면 전체 데이터를 반환 (검색어 없으면 전체 조회)
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== null && v !== "")
      );

      console.log("🔍 검색 요청 데이터:", params);

      const response = await axios.get(
        "http://localhost:8080/api/circles/search",
        { params }
      );

      console.log("✅ 백엔드에서 받은 원본 데이터:", response.data);
      setClubs(response.data || []);
    } catch (error) {
      console.error("❌ 검색한 모임정보 가져오는 중 오류 발생", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setSelectedCity(value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      city: value,
      district: "",
    }));
  };

  return (
    <section className="search-result-page-container">
      <div className="search-result-filter-section">
        <h3 className="search-result-filter-title">상세 조회</h3>
        <div className="search-result-filter-body">
          {/* ✅ 검색어 입력란을 상단 단독 블록으로 배치 */}
          <div className="search-result-filter-row search-bar">
            <input
              type="text"
              className="search-result-page-input"
              value={filters.clubTitle}
              onChange={(e) => handleFilterChange("clubTitle", e.target.value)}
              placeholder="검색어를 입력하세요 (비우면 전체 조회)"
            />
          </div>

          {/* ✅ 나머지 필터들은 한 줄로 정리 */}
          <div className="search-result-row">
            <div className="search-result-filter-row">
              <label>지역 (시/도):</label>
              <select value={filters.city} onChange={handleCityChange}>
                <option value="">전체</option>
                {areaData.map((region) => (
                  <option key={region.city} value={region.city}>
                    {region.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-result-filter-row">
              <label>지역 (시/군/구):</label>
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange("district", e.target.value)}
                disabled={!selectedCity}
              >
                <option value="">전체</option>
                {selectedCity &&
                  areaData
                    .find((region) => region.city === selectedCity)
                    ?.districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
              </select>
            </div>

            <div className="search-result-filter-row">
              <label>모임 시작 날짜:</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
              />
            </div>

            <div className="search-result-filter-row">
              <label>카테고리:</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">전체</option>
                <option value="친목">친목</option>
                <option value="독서">독서</option>
                <option value="전시">전시</option>
                <option value="스포츠">스포츠</option>
                <option value="스터디">스터디</option>
                <option value="맛집탐방">맛집탐방</option>
                <option value="취미활동">취미활동</option>
              </select>
            </div>
          </div>

          <div className="search-result-filter-apply-buttons">
            <button className="search-result-apply-button" onClick={fetchClubs}>
              필터 적용
            </button>
          </div>
        </div>
      </div>

      <div className="search-result-results">
        <h3>검색 결과</h3>
        <div className="search-result-club-results">
          {isLoading ? (
            <p>Loading...</p>
          ) : clubs.length > 0 ? (
            <CircleListDetail mockPosts={clubs} />
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
