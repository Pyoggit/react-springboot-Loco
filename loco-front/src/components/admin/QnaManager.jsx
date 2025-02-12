import React, { useState } from "react";
import "@/css/admin/QnaManager.css";

const QnaManager = () => {
  const [questions, setQuestions] = useState([
    {
      code: 501,
      user: "박영희",
      email: "park@example.com",
      question: "배송이 언제 오나요?",
      date: "2025-02-07",
    },
  ]);

  return (
    <div className="admin-qna-container">
      <table className="admin-qna-table">
        <thead>
          <tr>
            <th>QNA 코드</th>
            <th>작성자</th>
            <th>이메일</th>
            <th>질문 내용</th>
            <th>작성일자</th>
            <th>답변</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((qna) => (
            <tr key={qna.code}>
              <td>{qna.code}</td>
              <td>{qna.user}</td>
              <td>{qna.email}</td>
              <td>{qna.question}</td>
              <td>{qna.date}</td>
              <td>
                <button>답변 작성</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QnaManager;
