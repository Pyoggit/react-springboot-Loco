import React, { useEffect, useState, useRef, useContext } from "react";
import { stompClient } from "@/utils/WebSocketClient";
import { ChatContext } from "@/utils/ChatContext";
import "@/css/member/common/ChatRoom.css";

const ChatRoomPopup = ({ roomId, currentUserId, currentUserName }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { activeRoomId, resetUnread, incrementUnread, setActiveRoomId } =
    useContext(ChatContext);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    console.log("📡 WebSocket 연결 시도...");

    stompClient.onConnect = () => {
      console.log("✅ WebSocket 연결 성공!");
      subscribe();
    };

    stompClient.onWebSocketError = (error) => {
      console.error("❌ WebSocket 연결 오류:", error);
    };

    stompClient.onStompError = (frame) => {
      console.error("❌ STOMP 오류:", frame);
    };

    const subscribePath = `/topic/room.${roomId}`;

    const subscribe = () => {
      console.log(`✅ WebSocket 구독 중... ${subscribePath}`);

      subscriptionRef.current = stompClient.subscribe(
        subscribePath,
        (message) => {
          const received = JSON.parse(message.body);
          console.log("📩 새 메시지 수신:", received);

          setMessages((prev) => [...prev, received]);

          // ✅ 현재 활성 채팅방이 아니라면 알림 증가
          console.log(
            `🔍 현재 활성 채팅방: ${activeRoomId}, 메시지 roomId: ${received.roomId}`
          );

          if (activeRoomId !== received.roomId) {
            console.log("🔔 새 메시지 알림! (incrementUnread 실행)");
            incrementUnread();
          }
        }
      );
    };

    if (!stompClient.active) {
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
    console.log(`📌 채팅방 활성화: ${roomId}`);
    setActiveRoomId(roomId);
    resetUnread(); // ✅ 채팅방을 열면 unread 초기화
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "" || !currentUserId) return;

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
    } catch (error) {
      console.error("❌ 메시지 전송 실패:", error);
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
