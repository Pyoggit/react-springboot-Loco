import React from 'react';
import '@/css/member/circle/CircleListDetail.css';
const CircleListDetail = ({ mockPosts, selectedDate, onPostClick }) => {
  const filteredPosts = mockPosts.filter(
    (post) =>
      new Date(post.createdDate).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="content-section">
      <div className="mock-post-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-date">
                📅{' '}
                {new Date(post.createdDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
              <p className="post-time">🕒 {post.time}</p>
              <p className="post-description">{post.description}</p>
              <div></div>
              <div>
                <button
                  className="button-detail"
                  onClick={() => onPostClick(post)}
                >
                  상세보기
                </button>{' '}
                {/* ✅ 클릭 시 localStorage에 저장 */}
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
