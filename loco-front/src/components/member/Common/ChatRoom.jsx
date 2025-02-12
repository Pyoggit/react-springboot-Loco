import React, { useEffect, useState, useRef } from "react";
import { stompClient } from "@/utils/WebSocketClient";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const ChatRoom = () => {
  const { roomId } = useParams(); // 채팅방 구분(옵션)
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("익명");
  const messagesEndRef = useRef(null);
  const [cookies] = useCookies(["loginUser"]);

  useEffect(() => {
    // 로그인한 유저가 있으면 username 업데이트
    if (cookies.loginUser && cookies.loginUser.userName) {
      setUsername(cookies.loginUser.userName);
    }
  }, [cookies.loginUser]);

  useEffect(() => {
    stompClient.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      // 채팅방별 구독 경로 설정 (roomId가 없으면 public 채팅방)
      const subscribePath = roomId ? `/topic/room.${roomId}` : "/topic/public";
      stompClient.subscribe(subscribePath, (message) => {
        const received = JSON.parse(message.body);
        setMessages((prev) => [...prev, received]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomId]);

  // 새로운 메시지가 추가되면 스크롤 하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const messagePayload = {
      sender: username,
      content: inputMessage,
      type: "TALK",
      roomId: roomId || 0, // 필요 시 roomId 전송
    };

    stompClient.publish({
      destination: "/app/chat/send",
      body: JSON.stringify(messagePayload),
    });
    setInputMessage("");
  };

  return (
    <div>
      <h2>실시간 채팅</h2>
      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "scroll",
          padding: "5px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="메시지 입력..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
