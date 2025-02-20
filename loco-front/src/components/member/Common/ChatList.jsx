import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/utils/AxiosConfig";

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const userId = localStorage.getItem("userId");
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

  return (
    <div className="chat-list">
      <h2>내 채팅방</h2>
      {chatRooms.map((room) => (
        <div
          key={room.roomId}
          className="chat-room-item"
          onClick={() => navigate(`/chat/${room.roomId}`)}
        >
          <p>판매자: {room.sellerName}</p>
          <p>구매자: {room.buyerName}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
