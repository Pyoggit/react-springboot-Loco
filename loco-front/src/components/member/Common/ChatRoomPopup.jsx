import React, { useEffect, useState, useRef, useContext } from "react";
import { stompClient } from "@/utils/WebSocketClient";
import { ChatContext } from "@/utils/ChatContext";
import "@/css/member/common/ChatRoom.css";

const ChatRoomPopup = ({ roomId, currentUserId, currentUserName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { activeRoomId, resetUnread, incrementUnread } =
    useContext(ChatContext);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    // 채팅창이 열릴 때 unread 카운트 초기화
    resetUnread();
    const subscribePath = `/topic/room.${roomId}`;

    const subscribe = () => {
      // 구독을 수행하고 subscription 객체를 ref에 저장
      subscriptionRef.current = stompClient.subscribe(
        subscribePath,
        (message) => {
          const received = JSON.parse(message.body);
          setMessages((prev) => [...prev, received]);
          // 만약 현재 활성 채팅방이 아니라면 unread count 증가
          if (activeRoomId !== roomId) {
            incrementUnread();
          }
        }
      );
    };

    // 연결되어 있지 않다면 onConnect 콜백 내부에서 구독
    if (!stompClient.active) {
      stompClient.onConnect = () => {
        subscribe();
      };
      stompClient.activate();
    } else {
      subscribe();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [roomId, activeRoomId, resetUnread, incrementUnread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "" || !currentUserId) {
      console.warn("메시지를 입력하세요.");
      return;
    }

    const messagePayload = {
      senderId: currentUserId,
      senderName: currentUserName,
      content: inputMessage,
      type: "TALK",
      roomId,
    };

    try {
      stompClient.publish({
        destination: "/app/chat/send",
        body: JSON.stringify(messagePayload),
      });
      console.log("메시지 전송 성공:", messagePayload);
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지를 전송할 수 없습니다.");
    }
    setInputMessage("");
  };

  return (
    <div className="chat-room-container">
      <h2 className="chat-room-header">채팅방</h2>
      <div className="chat-room-messages">
        {messages.map((msg, index) => (
          <p key={index} className="chat-room-message">
            <strong>{msg.senderName}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-room-input-container">
        <input
          type="text"
          placeholder="메시지 입력..."
          className="chat-room-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="chat-room-send-button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomPopup;
