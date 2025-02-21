import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const userId = Number(localStorage.getItem("userId")); // 숫자로 변환
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`/api/chat/rooms/${userId}`)
      .then((res) => {
        setChatRooms(res.data);
      })
      .catch((err) => {
        console.error("채팅방 불러오기 실패:", err);
      });
  }, [userId]);

  /** ✅ 채팅방 삭제 */
  const handleDeleteChat = (roomId) => {
    if (!window.confirm("정말로 이 채팅방을 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/chat/room/${roomId}`)
      .then(() => {
        alert("채팅방이 삭제되었습니다.");
        setChatRooms((prevRooms) =>
          prevRooms.filter((room) => room.roomId !== roomId)
        );
      })
      .catch((err) => {
        console.error("채팅방 삭제 실패:", err);
        alert("채팅방 삭제에 실패했습니다.");
      });
  };

  return (
    <div className="chat-list">
      <h2>내 채팅방</h2>
      {chatRooms.length === 0 ? (
        <p>참여 중인 채팅방이 없습니다.</p>
      ) : (
        chatRooms.map((room) => {
          const isSeller = room.sellerId === userId;
          const chatPartner = isSeller ? room.buyerName : room.sellerName;

          return (
            <div key={room.roomId} className="chat-room-item">
              <div onClick={() => navigate(`/chat/${room.roomId}`)}>
                <p>
                  {isSeller
                    ? `구매자: ${chatPartner}`
                    : `판매자: ${chatPartner}`}
                </p>
              </div>
              <button
                className="chat-delete-button"
                onClick={() => handleDeleteChat(room.roomId)}
              >
                삭제
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChatList;
