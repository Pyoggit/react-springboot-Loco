import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeRoomId, _setActiveRoomId] = useState(null);

  const setActiveRoomId = (roomId) => {
    console.log(`🔄 setActiveRoomId 변경: ${roomId}`);
    _setActiveRoomId(roomId);
  };

  const incrementUnread = () => {
    console.log("🔔 incrementUnread 실행! 기존 카운트:", unreadCount);
    setUnreadCount((prev) => {
      console.log("📈 새 unreadCount:", prev + 1);
      return prev + 1;
    });
  };

  const resetUnread = () => {
    console.log("🔄 resetUnread 실행! 초기화");
    setUnreadCount(0);
  };

  return (
    <ChatContext.Provider
      value={{
        unreadCount,
        incrementUnread,
        resetUnread,
        activeRoomId,
        setActiveRoomId,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
