import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import CircleListDetail from "@/components/member/circle/CircleListDetail";
import { areaData } from "@/utils/areaData";
import "@/css/member/common/searchPage.css";

function SearchPage() {
  const location = useLocation();

  // URL Query Parameter에서 검색어와 카테고리 가져오기
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("query") || "";
  const initialCategory = queryParams.get("category") || "";

  const [filters, setFilters] = useState({
    clubTitle: initialSearchTerm,
    city: "",
    district: "",
    category: initialCategory,
    startDate: "",
    endDate: "",
  });

  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 시/도와 시/군/구 데이터를 가져오기 위한 상태
  const [selectedCity, setSelectedCity] = useState("");

  // 페이지 로딩 시 검색 실행
  useEffect(() => {
    fetchClubs();
  }, [filters]);

  const fetchClubs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:8080/api/club/search",
        { params: filters }
      );
      setClubs(response.data || []);
    } catch (error) {
      console.error("검색한 모임정보 가져오는 중 오류 발생", error);
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

  const handleResetFilter = () => {
    setFilters({
      clubTitle: "",
      city: "",
      district: "",
      category: "",
      startDate: "",
    });
    setSelectedCity("");
  };

  return (
    <section className="search-result-page-container">
      <div className="search-result-filter-section">
        <h3 className="search-result-filter-title">상세 조회</h3>
        <div className="search-result-filter-body">
          <div className="search-result-filter-row">
            <input
              type="text"
              className="search-result-page-input"
              value={filters.clubTitle}
              onChange={(e) => handleFilterChange("clubTitle", e.target.value)}
              placeholder="검색어를 입력하세요"
            />
          </div>

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
          </div>

          <div className="search-result-row">
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

          <div className="search-result-filter-apply-buttons">
            <button className="search-result-apply-button" onClick={fetchClubs}>
              필터 적용
            </button>
            <button
              className="search-result-reset-button"
              onClick={handleResetFilter}
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      <div className="search-result-results">
        <div>
          <h3>검색 결과</h3>
        </div>
        <div className="search-result-club-results">
          {!isLoading ? (
            <p>Loading...</p>
          ) : clubs.length > 0 ? (
            <CircleListDetail
              mockPosts={clubs}
              selectedDate={new Date()}
              onPostClick={(club) => console.log(club)}
            />
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
