import React, { useState } from "react";
import "@/css/admin/NoticeManager.css";

const NoticeManager = () => {
  const [notices, setNotices] = useState([
    { code: 1, content: "사이트 점검 공지", date: "2025-02-10" },
    { code: 2, content: "이벤트 공지", date: "2025-02-08" },
  ]);

  return (
    <div className="admin-notice-container">
      <button>공지 추가</button>
      <table className="admin-notice-table">
        <thead>
          <tr>
            <th>공지사항 코드</th>
            <th>내용</th>
            <th>작성일자</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.code}>
              <td>{notice.code}</td>
              <td>{notice.content}</td>
              <td>{notice.date}</td>
              <td>
                <button>수정</button>
                <button>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NoticeManager;
