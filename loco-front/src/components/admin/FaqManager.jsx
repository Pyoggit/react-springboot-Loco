import React, { useState } from "react";
import "@/css/admin/FaqManager.css";

const FaqManager = () => {
  const [faqs, setFaqs] = useState([
    {
      code: "FAQ001",
      question: "비밀번호 변경은 어떻게 하나요?",
      answer: "설정에서 변경 가능합니다.",
    },
  ]);

  return (
    <div className="admin-faq-container">
      <button>FAQ 추가</button>
      <table>
        <thead>
          <tr>
            <th>코드</th>
            <th>질문</th>
            <th>답변</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((f, index) => (
            <tr key={index}>
              <td>{f.code}</td>
              <td>{f.question}</td>
              <td>{f.answer}</td>
              <td>
                <button>수정</button> <button>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FaqManager;
