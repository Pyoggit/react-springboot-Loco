import React from 'react';
import '@/css/member/circle/CircleListDetail.css';

const CircleListDetail = ({ mockPosts, onPostClick }) => {
  if (!mockPosts || mockPosts.length === 0)
    return <p className="no-posts">📭 검색 결과가 없습니다.</p>;

  return (
    <div className="content-section">
      <div className="mock-post-container">
        {mockPosts.map((post) => (
          <div key={post.circleId} className="post-card">
            {/* ✅ 이미지 추가 */}
            <div className="post-image">
              <img
                src={
                  post.pictureUrl
                    ? post.pictureUrl
                    : '/images/default-image.png'
                }
                alt={post.circleName}
                className="circle-image"
              />
            </div>

            <h3 className="post-title">{post.circleName}</h3>
            <p className="post-date">
              📅{' '}
              {new Date(post.circleDate).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </p>
            <p className="post-description">{post.circleDetail}</p>
            <div>
              <button
                className="button-detail"
                onClick={() => onPostClick(post)}
              >
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircleListDetail;
