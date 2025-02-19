import React from 'react';
import '@/css/member/circle/CircleListDetail.css';

const CircleListDetail = ({ mockPosts, onPostClick }) => {
  if (!mockPosts || mockPosts.length === 0)
    return <p className="no-posts">📭 검색 결과가 없습니다.</p>;

  return (
    <div className="content-section">
      <div className="mock-post-container">
        {mockPosts.map((post) => {
          // ✅ 최신 `pictureUrl` 적용 (localStorage 확인)
          const storedPost = localStorage.getItem('selectedPost');
          let updatedPictureUrl = post.pictureId
            ? `${import.meta.env.VITE_API_URL}/upload/${post.pictureId}`
            : '/images/default-image.png';

          if (storedPost) {
            const parsedPost = JSON.parse(storedPost);
            if (parsedPost.circleId === post.circleId) {
              updatedPictureUrl = `${import.meta.env.VITE_API_URL}${
                parsedPost.pictureUrl
              }?t=${new Date().getTime()}`;
            }
          }

          return (
            <div key={post.circleId} className="post-card">
              <div className="post-image">
                <img
                  src={updatedPictureUrl}
                  alt={post.circleName}
                  className="circle-image"
                  onError={(e) => {
                    e.target.src = '/images/default-image.png';
                  }}
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
          );
        })}
      </div>
    </div>
  );
};

export default CircleListDetail;
