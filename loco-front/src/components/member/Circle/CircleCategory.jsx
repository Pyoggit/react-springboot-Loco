import { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/CircleCategory.css';
const CircleSidebar = () => {
  const categories = [
    '전체',
    '스포츠',
    '독서',
    '전시',
    '사교/인맥',
    '문화/공연/축제',
    '게임 오락',
    '음악/악기',
    '댄스/무용',
    '여행',
    '봉사활동',
    '공예/원데이클레스',
    '반려동물',
    '사진/영상',
    '기타',
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCheckboxChange = (category) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // 이미 선택된 경우 제거
          : [...prev, category] // 선택되지 않았다면 추가
    );
  };

  return (
    <aside>
      <div className="itemShoesTab">
        {/* 카테고리별 이동 링크 */}
        <ul className="itemShoesTab">
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
