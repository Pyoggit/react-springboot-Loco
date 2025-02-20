import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  // activeRoomId: 현재 열려있는 채팅방 ID (헤더 팝업에서 사용)
  const [activeRoomId, setActiveRoomId] = useState(null);

  const incrementUnread = () => setUnreadCount((prev) => prev + 1);
  const resetUnread = () => setUnreadCount(0);

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
