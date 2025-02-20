import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/BoardNew.css";

const BoardNew = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    writer: "",
    type: "", // 기본값을 빈 문자열로 설정
    userId: "", // 임시 사용자 ID 추가
  });

  //userId 가져오기
  const myuserName = localStorage.getItem("userName");
  const myuserId = localStorage.getItem("userId");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** ✅ 폼 제출 핸들러 */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, content, writer, type, userId } = formData;
    if (!title || !content || !type) {
      console.log("writer" + writer);
      alert("제목, 내용, 작성자, 게시글 유형을 모두 입력해주세요.");
      return;
    }

    // ✅ FormData 생성
    const formDataToSend = new FormData();

    // ✅ JSON 데이터를 Blob 형태로 추가
    const postData = {
      title: title,
      content: content,
      writer: myuserName,
      type: type,
      userId: myuserId, // ✅ userId 포함
    };
    console.log("***************************************");
    console.dir(postData);
    console.log("***************************************");
    formDataToSend.append(
      "post",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/board/new`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("게시글이 성공적으로 등록되었습니다!");
        navigate(`/board/${type}`);
      }
    } catch (error) {
      console.error("게시글 등록 실패:", error);
      alert(
        `게시글 등록에 실패했습니다: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="new-list-container">
      <header className="new-header">
        <div className="new-title">글 작성하기</div>
      </header>
      <form onSubmit={handleSubmit} className="new-editor">
        <div className="new-input">
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="new-select-field"
          >
            <option value="">게시판 선택</option> {/* 기본 선택 옵션 추가 */}
            <option value="notice">공지사항</option>
            <option value="freeboard">자유</option>
            <option value="qna">Q&A</option>
            <option value="faq">FAQ</option>
            <option value="improvement">불편&개선사항</option>
            <option value="report">신고</option>
          </select>
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={handleChange}
            className="new-input-field"
          />
          <input
            type="text"
            name="writer"
            placeholder="작성자"
            value={myuserName}
            disabled="true"
            className="new-input-field"
          />
          {/* 파일 업로드 관련 input과 이미지 미리보기 부분을 제거함 */}
          <textarea
            name="content"
            placeholder="내용"
            rows={15}
            value={formData.content}
            onChange={handleChange}
            className="new-textarea"
          />
          <div className="new-notice-button">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="new-cancel-btn"
            >
              취소하기
            </button>
            <button type="submit" className="new-submit-btn">
              등록하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BoardNew;

// import React, { useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "@/css/member/board/BoardNew.css";

// const BoardNew = () => {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   const [formData, setFormData] = useState({
//     title: "",
//     content: "",
//     writer: "",
//     type: "", // 기본값을 빈 문자열로 설정
//     userId: "", // 임시 사용자 ID 추가
//     image: null,
//     imagePreview: "",
//   });

//   //userId 가져오기
//   const myuserName = localStorage.getItem("userName");
//   const myuserId = localStorage.getItem("userId");
//   // setFormData({ ...formData, userName: myuserName }); /** ✅ 입력 값 핸들러 */

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   /** ✅ 파일 선택 핸들러 */
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       setFormData((prev) => ({
//         ...prev,
//         image: file,
//         imagePreview: URL.createObjectURL(file),
//       }));
//     }
//   };

//   /** ✅ 폼 제출 핸들러 */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const { title, content, writer, type, userId, image } = formData;
//     if (!title || !content || !type) {
//       console.log("writer" + writer);
//       alert("제목, 내용, 작성자, 게시글 유형을 모두 입력해주세요.");
//       return;
//     }

//     // ✅ FormData 생성
//     const formDataToSend = new FormData();

//     // ✅ JSON 데이터를 Blob 형태로 추가
//     const postData = {
//       title: title,
//       content: content,
//       writer: myuserName,
//       type: type,
//       userId: myuserId, // ✅ userId 포함
//     };
//     console.log("***************************************");
//     console.dir(postData);
//     console.log("***************************************");
//     formDataToSend.append(
//       "post",
//       new Blob([JSON.stringify(postData)], { type: "application/json" })
//     );

//     // ✅ 이미지 추가 (한 장만 업로드 가능)
//     if (image) {
//       formDataToSend.append("image", image);
//     }

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/board/new`,
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("게시글이 성공적으로 등록되었습니다!");
//         navigate(`/board/${type}`);
//       }
//     } catch (error) {
//       console.error("게시글 등록 실패:", error);
//       alert(
//         `게시글 등록에 실패했습니다: ${
//           error.response?.data?.message || error.message
//         }`
//       );
//     }
//   };

//   return (
//     <div className="new-list-container">
//       <header className="new-header">
//         <div className="new-title">글 작성하기</div>
//       </header>
//       <form onSubmit={handleSubmit} className="new-editor">
//         <div className="new-input">
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             className="new-select-field"
//           >
//             <option value="">게시판 선택</option> {/* 기본 선택 옵션 추가 */}
//             <option value="notice">공지사항</option>
//             <option value="freeboard">자유</option>
//             <option value="qna">Q&A</option>
//             <option value="faq">FAQ</option>
//             <option value="improvement">불편&개선사항</option>
//             <option value="report">신고</option>
//           </select>
//           <input
//             type="text"
//             name="title"
//             placeholder="제목"
//             value={formData.title}
//             onChange={handleChange}
//             className="new-input-field"
//           />
//           <input
//             type="text"
//             name="writer"
//             placeholder="작성자"
//             value={myuserName}
//             disabled="true"
//             className="new-input-field"
//           />
//           <input
//             type="file"
//             name="image"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             className="new-input-file"
//             accept="image/*"
//           />
//           {/* 이미지 미리보기 추가 */}
//           {formData.imagePreview && (
//             <div className="image-preview-container">
//               <img
//                 src={formData.imagePreview}
//                 alt="미리보기"
//                 className="image-preview"
//               />
//             </div>
//           )}
//           <textarea
//             name="content"
//             placeholder="내용"
//             rows={15}
//             value={formData.content}
//             onChange={handleChange}
//             className="new-textarea"
//           />
//           <div className="new-notice-button">
//             <button
//               type="button"
//               onClick={() => navigate(-1)}
//               className="new-cancel-btn"
//             >
//               취소하기
//             </button>
//             <button type="submit" className="new-submit-btn">
//               등록하기
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BoardNew;
