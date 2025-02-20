import React, { useState, useEffect } from 'react';
import '@/css/member/circle/CircleListDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 꽉 찬 하트
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트

const CircleListDetail = ({ mockPosts, onPostClick }) => {
  const [likedCircles, setLikedCircles] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});

  // ✅ 관심 모임 목록 및 좋아요 개수 불러오기
  useEffect(() => {
    const storedLikes = localStorage.getItem('likedCircles');
    if (storedLikes) {
      setLikedCircles(JSON.parse(storedLikes));
    }

    const storedLikeCounts = localStorage.getItem('likeCounts');
    if (storedLikeCounts) {
      setLikeCounts(JSON.parse(storedLikeCounts));
    }
  }, []);

  // ✅ 좋아요 상태 변경 함수
  const toggleLike = (circleId) => {
    let updatedLikes;
    let updatedLikeCounts = { ...likeCounts };

    if (likedCircles.includes(circleId)) {
      updatedLikes = likedCircles.filter((id) => id !== circleId); // 제거
      updatedLikeCounts[circleId] = (updatedLikeCounts[circleId] || 1) - 1; // 개수 감소
    } else {
      updatedLikes = [...likedCircles, circleId]; // 추가
      updatedLikeCounts[circleId] = (updatedLikeCounts[circleId] || 0) + 1; // 개수 증가
    }

    setLikedCircles(updatedLikes);
    setLikeCounts(updatedLikeCounts);
    localStorage.setItem('likedCircles', JSON.stringify(updatedLikes)); // 관심 모임 저장
    localStorage.setItem('likeCounts', JSON.stringify(updatedLikeCounts)); // 좋아요 개수 저장
  };

  if (!mockPosts || mockPosts.length === 0)
    return <h1 className="no-posts">현재 날짜 모임이 없습니다.</h1>;

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
                {' '}
                {new Date(post.circleDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </p>
              <p className="post-category">#{post.circleCategory}</p>
              <p className="post-description">{post.circleDetail}</p>
              <div>
                <div className="post-button">
                  <button
                    className="button-detail"
                    onClick={() => onPostClick(post)}
                  >
                    상세보기
                  </button>
                  <div className="like-count-container">
                    <button
                      className="like-button"
                      onClick={() => toggleLike(post.circleId)}
                    >
                      <FontAwesomeIcon
                        icon={
                          likedCircles.includes(post.circleId)
                            ? solidHeart
                            : regularHeart
                        }
                        className="like-icon"
                      />
                    </button>
                    <span className="like-count">
                      {likeCounts[post.circleId] || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CircleListDetail;
