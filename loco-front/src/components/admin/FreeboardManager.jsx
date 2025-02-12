import React, { useState } from "react";
import "@/css/admin/FreeboardManager.css";

const FreeboardManager = () => {
  const [posts, setPosts] = useState([
    {
      code: 1001,
      writer: "김철수",
      email: "chul@example.com",
      content: "안녕하세요!",
      date: "2025-02-09",
    },
  ]);

  return (
    <div className="admin-freeboard-container">
      <table className="admin-freeboard-table">
        <thead>
          <tr>
            <th>게시글 코드</th>
            <th>작성자</th>
            <th>이메일</th>
            <th>내용</th>
            <th>게시일자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.code}>
              <td>{post.code}</td>
              <td>{post.writer}</td>
              <td>{post.email}</td>
              <td>{post.content}</td>
              <td>{post.date}</td>
              <td>
                <button>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FreeboardManager;
