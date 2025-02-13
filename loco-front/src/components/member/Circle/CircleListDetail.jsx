import React from 'react';
import '@/css/member/circle/CircleListDetail.css';

const CircleListDetail = ({ mockPosts, selectedDate, onPostClick }) => {
  if (!mockPosts || !selectedDate)
    return <p className="no-posts">📭 표시할 모임이 없습니다.</p>;

  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

  const filteredPosts = mockPosts.filter((post) => {
    if (!post.circleDate) return false;
    const postDate = new Date(post.circleDate).toISOString().split('T')[0];
    return postDate === formattedSelectedDate;
  });

  return (
    <div className="content-section">
      <div className="mock-post-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
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
              <p className="post-time">🕒 {post.circleDate.split(' ')[1]}</p>
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
          ))
        ) : (
          <p className="no-posts">해당 날짜에 모임이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CircleListDetail;
