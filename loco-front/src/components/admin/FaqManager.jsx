import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";
import "@/css/admin/FaqManager.css";

const FaqManager = () => {
  const [faqs, setFaqs] = useState([]);
  const navigate = useNavigate();

  // ✅ FAQ 목록 불러오기
  useEffect(() => {
    axios
      .get("/api/board/faq")
      .then((response) => setFaqs(response.data))
      .catch((error) => console.error("FAQ 불러오기 실패:", error));
  }, []);

  // ✅ FAQ 추가 버튼 클릭 시 /board/new로 이동
  const handleAddFaq = () => {
    navigate("/board/new");
  };

  // ✅ FAQ 삭제
  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/board/faq/${id}`);
        setFaqs(faqs.filter((faq) => faq.boardId !== id));
      } catch (error) {
        console.error("FAQ 삭제 실패:", error);
      }
    }
  };

  return (
    <div className="admin-faq-container">
      <button onClick={handleAddFaq}>FAQ 추가</button>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>질문</th>
            <th>답변</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {faqs.map((faq) => (
            <tr key={faq.boardId}>
              <td>{faq.boardId}</td>
              <td>{faq.title}</td>
              <td>{faq.content}</td>
              <td>
                <button onClick={() => navigate(`/board/edit/${faq.boardId}`)}>
                  수정
                </button>
                <button onClick={() => handleDelete(faq.boardId)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FaqManager;
