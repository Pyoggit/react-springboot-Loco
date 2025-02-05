import { useState } from 'react';
import '@/css/member/circle/CircleCategory.css';

const CircleSidebar = () => {
  const categories = [
    '전체',
    '스포츠/경기관람',
    '자기개발',
    '사교/인맥',
    '문화/공연/축제/전시',
    '게임/오락',
    '음악/악기댄스/무용',
    '여행/등산',
    '봉사활동',
    '공예/원데이클레스',
    '반려동물',
    '기타',
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <aside>
      <button
        className="category-toggle-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {isDropdownOpen ? '카테고리 닫기 ▲' : '카테고리 보기 ▼'}
      </button>

      <div
        className={`category-dropdown ${isDropdownOpen ? 'open' : 'closed'}`}
      >
        <ul className="category-list">
          {categories.map((cate) => (
            <li key={cate}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cate)}
                  onChange={() => handleCheckboxChange(cate)}
                />
                {cate}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default CircleSidebar;
