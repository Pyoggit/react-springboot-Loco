import React, { useEffect, useState } from "react";
import { stompClient } from "@/utils/WebSocketClient";

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    stompClient.onConnect = () => {
      console.log("✅ WebSocket 연결 성공");
      stompClient.subscribe("/topic/public", (message) => {
        setMessages((prev) => [...prev, JSON.parse(message.body)]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      stompClient.publish({
        destination: "/app/chat/send",
        body: JSON.stringify({
          sender: username || "익명",
          content: inputMessage,
          type: "TALK",
        }),
      });
      setInputMessage("");
    }
  };

  return (
    <div>
      <h2>실시간 채팅</h2>
      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};

export default ChatRoom;
