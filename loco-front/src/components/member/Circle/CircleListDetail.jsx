import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@/css/member/circle/CircleListDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons'; // 꽉 찬 하트
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // 빈 하트

const CircleListDetail = ({ mockPosts, onPostClick }) => {
  const [likedCircles, setLikedCircles] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const userId = localStorage.getItem('userId'); // ✅ 현재 로그인한 유저 ID 가져오기

  // ✅ 서버에서 사용자가 좋아요한 모임 리스트 가져오기
  const fetchLikedCircles = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/circles/user/${userId}/liked`
      );
      setLikedCircles(response.data.map((circle) => circle.circleId)); // ✅ 좋아요한 모임 ID만 저장
    } catch (error) {
      console.error('❌ 관심 모임 불러오기 실패:', error);
    }
  };

  // ✅ 서버에서 각 모임의 좋아요 개수 가져오기
  const fetchLikeCounts = async () => {
    try {
      const counts = {};
      for (const post of mockPosts) {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/circles/${post.circleId}/likes`
        );
        counts[post.circleId] = response.data;
      }
      setLikeCounts(counts);
    } catch (error) {
      console.error('❌ 좋아요 개수 불러오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchLikedCircles();
    fetchLikeCounts();
  }, [mockPosts]); // ✅ mockPosts가 변경될 때마다 좋아요 상태 및 개수 갱신

  // ✅ 좋아요 상태 변경 (서버와 연동)
  const toggleLike = async (circleId) => {
    if (!userId) {
      alert('로그인이 필요합니다!');
      return;
    }

    try {
      if (likedCircles.includes(circleId)) {
        // ✅ 이미 좋아요 → 취소
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/like`,
          { data: { userId } }
        );
        setLikedCircles((prev) => prev.filter((id) => id !== circleId));
        setLikeCounts((prev) => ({
          ...prev,
          [circleId]: Math.max(0, (prev[circleId] || 1) - 1),
        }));
      } else {
        // ✅ 좋아요 추가
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/circles/${circleId}/like`,
          {
            userId,
          }
        );
        setLikedCircles((prev) => [...prev, circleId]);
        setLikeCounts((prev) => ({
          ...prev,
          [circleId]: (prev[circleId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('❌ 좋아요 처리 실패:', error);
    }
  };

  if (!mockPosts || mockPosts.length === 0)
    return <h2 className="circle-no-posts">현재 날짜 모임이 없습니다.</h2>;

  return (
    <div className="content-section">
      <div className="mock-post-container">
        {mockPosts.map((post) => {
          // ✅ 최신 `pictureUrl` 적용
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
                    className="button-circle-detail"
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
