import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "@/css/member/board/FreeView.css"; // 원래 CSS 파일명 그대로 사용

const BoardView = () => {
  // URL에서 게시판 타입과 게시글 ID를 받아옵니다.
  const { type, boardId } = useParams();
  const [boardItem, setBoardItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  // 댓글 수정 관련 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const nav = useNavigate();

  //userId 가져오기
  const myuserName = localStorage.getItem("userName");
  const myuserId = localStorage.getItem("userId");

  // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
  const getStringedDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("ko-KR", options);
  };

  // 게시글 및 댓글 데이터 백엔드 API에서 받아오기 (조회수 1 증가 포함)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 조회수 증가 POST 요청 (PATCH 대신)
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/views`
        );
        // 게시글과 댓글 데이터 GET 요청 (응답은 { board: {...}, comments: [...] } 형태로 가정)
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
        );
        setBoardItem(response.data.board);
        setComments(response.data.comments);
      } catch (error) {
        console.error("게시글 조회 실패:", error);
      }
    };

    fetchData();
  }, [type, boardId]);

  // 게시글 삭제 처리
  const onClickDelete = async () => {
    if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
        );
        window.alert("삭제되었습니다.");
        nav(`/board/${type}`);
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        window.alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 게시글 수정 페이지로 이동 (상태로 게시글 데이터를 전달)
  const onClickEdit = () => {
    nav(`/board/${type}/boardeditor/${boardId}`, { state: { boardItem } });
  };
  // 취소 시 게시판 목록 페이지로 이동
  const onClickCancel = () => {
    nav(`/board/${type}`);
  };

  // 댓글 등록 처리 (이미지 없이 텍스트만)
  const onAddComment = async () => {
    if (!newComment.trim()) {
      window.alert("댓글을 입력하세요.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/comments`,
        {
          userId: myuserId, // 실제 사용자 ID로 대체 필요
          content: newComment,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("댓글 등록 성공, 응답:", response.data);
      // 새로운 댓글을 기존 댓글 배열에 추가
      setComments((prevComments) => [...prevComments, response.data]);

      // 등록 후 입력 필드 초기화
      setNewComment("");
    } catch (error) {
      console.error("댓글 추가 실패:", error);
      window.alert("댓글 추가 중 오류가 발생했습니다.");
    }
  };

  // 댓글 수정 처리
  const onSaveEditedComment = async (commentId) => {
    if (!editingCommentContent.trim()) {
      window.alert("수정할 내용을 입력하세요.");
      return;
    }
    try {
      const response = await axios.put(
        `${
          import.meta.env.VITE_API_URL
        }/api/board/${type}/comments/${commentId}`,
        {
          writer: "현재사용자", // 필요 시 작성자 정보 포함
          content: editingCommentContent,
        }
      );
      // 댓글 목록 업데이트: 수정된 댓글 반영
      setComments(
        comments.map((c) => (c.commentId === commentId ? response.data : c))
      );
      setEditingCommentId(null);
      setEditingCommentContent("");
    } catch (error) {
      console.error("댓글 수정 실패:", error);
      window.alert("댓글 수정 중 오류가 발생했습니다.");
    }
  };

  // 댓글 삭제 처리
  const onDeleteComment = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_API_URL
        }/api/board/${type}/comments/${commentId}`
      );
      setComments(comments.filter((c) => c.commentId !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      window.alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!boardItem) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="freeview-freeBoardView">
      <header className="freeview-header">
        <div className="freeview-title">글 보기</div>
      </header>

      <div className="freeview-boardView">
        <div className="freeview-top-buttons">
          <button onClick={onClickEdit} className="freeview-editButton">
            수정
          </button>
          <button onClick={onClickDelete} className="freeview-deleteButton">
            삭제
          </button>
          <button onClick={onClickCancel} className="freeview-cancelButton">
            취소
          </button>
        </div>
        <div className="freeview-table">
          <table>
            <tbody>
              <tr height="60px">
                <td colSpan={2}>
                  <strong>{boardItem.title}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>{boardItem.content}</td>
              </tr>
              {/* 이미지 관련 코드 제거됨 */}
              <tr height="80px">
                <td>작성자 : {boardItem.userEmail}</td>
                <td>작성일 : {getStringedDate(boardItem.boardRegdate)}</td>
              </tr>
              <tr>
                <td colSpan={2}>조회수 : {boardItem.views}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="freeview-comments">
        <h3>댓글달기</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              {editingCommentId === comment.commentId ? (
                <div>
                  <textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="freeview-textarea"
                  />
                  <button
                    onClick={() => onSaveEditedComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingCommentContent("");
                    }}
                    className="freeview-commentButton"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div>
                  <strong>{boardItem.userEmail}:</strong> {comment.content}
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.commentId);
                      setEditingCommentContent(comment.content);
                    }}
                    className="freeview-commentButton"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteComment(comment.commentId)}
                    className="freeview-commentButton"
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="freeview-commentInput">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="freeview-textarea"
          />
          <button onClick={onAddComment} className="freeview-commentButton">
            댓글 달기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardView;

// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import "@/css/member/board/FreeView.css"; // 원래 CSS 파일명 그대로 사용

// const BoardView = () => {
//   // URL에서 게시판 타입과 게시글 ID를 받아옵니다.
//   const { type, boardId } = useParams();
//   const [boardItem, setBoardItem] = useState(null);
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   // 댓글 수정 관련 상태
//   const [editingCommentId, setEditingCommentId] = useState(null);
//   const [editingCommentContent, setEditingCommentContent] = useState("");
//   const nav = useNavigate();

//   //userId 가져오기
//   const myuserName = localStorage.getItem("userName");
//   const myuserId = localStorage.getItem("userId");

//   // 날짜를 "YYYY-MM-DD" 형식으로 반환하는 함수
//   const getStringedDate = (date) => {
//     const options = { year: "numeric", month: "2-digit", day: "2-digit" };
//     return new Date(date).toLocaleDateString("ko-KR", options);
//   };

//   // 게시글 및 댓글 데이터 백엔드 API에서 받아오기 (조회수 1 증가 포함)
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // 조회수 증가 POST 요청 (PATCH 대신)
//         await axios.post(
//           `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/views`
//         );
//         // 게시글과 댓글 데이터 GET 요청 (응답은 { board: {...}, comments: [...] } 형태로 가정)
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
//         );
//         setBoardItem(response.data.board);
//         setComments(response.data.comments);
//       } catch (error) {
//         console.error("게시글 조회 실패:", error);
//       }
//     };

//     fetchData();
//   }, [type, boardId]);

//   // 게시글 삭제 처리
//   const onClickDelete = async () => {
//     if (window.confirm("정말로 이 글을 삭제하시겠습니까?")) {
//       try {
//         await axios.delete(
//           `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}`
//         );
//         window.alert("삭제되었습니다.");
//         nav(`/board/${type}`);
//       } catch (error) {
//         console.error("게시글 삭제 실패:", error);
//         window.alert("게시글 삭제 중 오류가 발생했습니다.");
//       }
//     }
//   };

//   // 게시글 수정 페이지로 이동 (상태로 게시글 데이터를 전달)
//   const onClickEdit = () => {
//     nav(`/board/${type}/boardeditor/${boardId}`, { state: { boardItem } });
//   };
//   // 취소 시 게시판 목록 페이지로 이동
//   const onClickCancel = () => {
//     nav(`/board/${type}`);
//   };

//   // 댓글 등록 처리 (이미지 없이 텍스트만)
//   const onAddComment = async () => {
//     if (!newComment.trim()) {
//       window.alert("댓글을 입력하세요.");
//       return;
//     }
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/api/board/${type}/${boardId}/comments`,
//         {
//           userId: myuserId, // 실제 사용자 ID로 대체 필요
//           content: newComment,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       console.log("댓글 등록 성공, 응답:", response.data);
//       // ✅ 새로운 댓글을 맨 위에 추가 (최근 댓글이 먼저 보이도록)
//       setComments((prevComments) => [...prevComments, response.data]);

//       // 등록 후 입력 필드 초기화
//       setNewComment("");
//     } catch (error) {
//       console.error("댓글 추가 실패:", error);
//       window.alert("댓글 추가 중 오류가 발생했습니다.");
//     }
//   };

//   // 댓글 수정 처리
//   const onSaveEditedComment = async (commentId) => {
//     if (!editingCommentContent.trim()) {
//       window.alert("수정할 내용을 입력하세요.");
//       return;
//     }
//     try {
//       const response = await axios.put(
//         `${
//           import.meta.env.VITE_API_URL
//         }/api/board/${type}/comments/${commentId}`,
//         {
//           writer: "현재사용자", // 필요 시 작성자 정보 포함
//           content: editingCommentContent,
//         }
//       );
//       // 댓글 목록 업데이트: 수정된 댓글 반영
//       setComments(
//         comments.map((c) => (c.commentId === commentId ? response.data : c))
//       );
//       setEditingCommentId(null);
//       setEditingCommentContent("");
//     } catch (error) {
//       console.error("댓글 수정 실패:", error);
//       window.alert("댓글 수정 중 오류가 발생했습니다.");
//     }
//   };

//   // 댓글 삭제 처리
//   const onDeleteComment = async (commentId) => {
//     if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
//     try {
//       await axios.delete(
//         `${
//           import.meta.env.VITE_API_URL
//         }/api/board/${type}/comments/${commentId}`
//       );
//       setComments(comments.filter((c) => c.commentId !== commentId));
//     } catch (error) {
//       console.error("댓글 삭제 실패:", error);
//       window.alert("댓글 삭제 중 오류가 발생했습니다.");
//     }
//   };

//   if (!boardItem) {
//     return <div>로딩 중...</div>;
//   }

//   // 이미지 URL을 처리하는 함수: 절대경로가 아니면 업로드 폴더 경로를 붙여줍니다.
//   const getImageUrl = (url) => {
//     if (!url) return null;
//     return url.startsWith("http")
//       ? url
//       : `${import.meta.env.VITE_API_URL}/upload/${url}`;
//   };

//   return (
//     <div className="freeview-freeBoardView">
//       <header className="freeview-header">
//         <div className="freeview-title">글 보기</div>
//       </header>

//       <div className="freeview-boardView">
//         <div className="freeview-top-buttons">
//           <button onClick={onClickEdit} className="freeview-editButton">
//             수정
//           </button>
//           <button onClick={onClickDelete} className="freeview-deleteButton">
//             삭제
//           </button>
//           <button onClick={onClickCancel} className="freeview-cancelButton">
//             취소
//           </button>
//         </div>
//         <div className="freeview-table">
//           <table>
//             <tbody>
//               <tr height="60px">
//                 <td colSpan={2}>
//                   <strong>{boardItem.title}</strong>
//                 </td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>{boardItem.content}</td>
//               </tr>
//               {boardItem.pictureUrl || boardItem.PICTURE_URL ? (
//                 <tr>
//                   <td colSpan={2}>
//                     <img
//                       src={getImageUrl(
//                         boardItem.pictureUrl || boardItem.PICTURE_URL
//                       )}
//                       alt="Uploaded"
//                       className="freeview-image"
//                     />
//                   </td>
//                 </tr>
//               ) : (
//                 <tr>
//                   <td colSpan={2}>
//                     <img
//                       src="/images/default-image.png"
//                       alt="Default"
//                       className="freeview-image"
//                     />
//                   </td>
//                 </tr>
//               )}

//               <tr height="80px">
//                 <td>작성자 : {myuserName}</td>
//                 <td>작성일 : {getStringedDate(boardItem.boardRegdate)}</td>
//               </tr>
//               <tr>
//                 <td colSpan={2}>조회수 : {boardItem.views}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="freeview-comments">
//         <h3>댓글달기</h3>
//         <ul>
//           {comments.map((comment) => (
//             <li key={comment.commentId}>
//               {editingCommentId === comment.commentId ? (
//                 <div>
//                   <textarea
//                     value={editingCommentContent}
//                     onChange={(e) => setEditingCommentContent(e.target.value)}
//                     className="freeview-textarea"
//                   />
//                   <button
//                     onClick={() => onSaveEditedComment(comment.commentId)}
//                     className="freeview-commentButton"
//                   >
//                     수정
//                   </button>
//                   <button
//                     onClick={() => {
//                       setEditingCommentId(null);
//                       setEditingCommentContent("");
//                     }}
//                     className="freeview-commentButton"
//                   >
//                     취소
//                   </button>
//                 </div>
//               ) : (
//                 <div>
//                   <strong>{myuserName}:</strong> {comment.content}
//                   <button
//                     onClick={() => {
//                       setEditingCommentId(comment.commentId);
//                       setEditingCommentContent(comment.content);
//                     }}
//                     className="freeview-commentButton"
//                   >
//                     수정
//                   </button>
//                   <button
//                     onClick={() => onDeleteComment(comment.commentId)}
//                     className="freeview-commentButton"
//                   >
//                     삭제
//                   </button>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//         <div className="freeview-commentInput">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="댓글을 입력하세요..."
//             className="freeview-textarea"
//           />
//           <button onClick={onAddComment} className="freeview-commentButton">
//             댓글 달기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardView;
