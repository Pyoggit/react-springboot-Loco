import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { useCookies } from "react-cookie";
import axios from "@/utils/AxiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faSquareCaretDown } from "@fortawesome/free-regular-svg-icons";
import { ChatContext } from "@/utils/ChatContext";
import ChatRoomPopup from "../../components/member/Common/ChatRoomPopup";
import "./style.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies([
    "loginUser",
    "normal_accessToken",
    "kakao_accessToken",
  ]);
  const [isLogin, setLogin] = useState(false);
  const [isSearchPage, setSearchPage] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  const {
    unreadCount,
    activeRoomId,
    setActiveRoomId,
    newMessageAlert,
    setNewMessageAlert,
  } = useContext(ChatContext);

  const MAIN_PATH = () => "/";
  const LOGIN_PATH = () => "/login";
  const SEARCH_PATH = () => "/search";
  const USER_PATH = () => "/mypage";

  const fetchUserInfo = async () => {
    const normalAccessToken = localStorage.getItem("normal_accessToken");
    const kakaoAccessToken = localStorage.getItem("kakao_accessToken");

    let accessToken = normalAccessToken || kakaoAccessToken;

    if (!accessToken) {
      console.warn("🚨 저장된 토큰 없음 → API 요청 안 보냄");
      setLogin(false);
      setLoginUser(null);
      return;
    }

    try {
      console.log("📌 Authorization 헤더 추가: ", accessToken);

      const response = await axios.get("/api/users/mypage", {
        headers: {
          Authorization: `Bearer ${accessToken}`, // ✅ 헤더에 토큰 추가
        },
      });

      console.log("📌 로그인 상태 확인:", response.data);
      setLoginUser(response.data);
      setLogin(true);
    } catch (error) {
      console.error("🚨 로그인 토큰 없음 → 로그인 상태 초기화", error);
      setLogin(false);
      setLoginUser(null);
    }
  };

  const fetchChatRooms = async (userId) => {
    try {
      const response = await axios.get(`/api/chat/rooms/${userId}`);
      console.log("✅ 채팅방 목록:", response.data);
      setChatRooms(response.data);
    } catch (error) {
      console.error("❌ 채팅방 목록 불러오기 실패:", error);
    }
  };

  // ✅ useEffect에서 `fetchUserInfo` 호출 (로그인 상태 체크)
  useEffect(() => {
    (async () => {
      await fetchUserInfo();
    })();
  }, []);

  useEffect(() => {
    if (loginUser?.userId) {
      fetchChatRooms(loginUser.userId);
    }
  }, [loginUser]);

  const toggleChatPopup = () => {
    setShowChat((prev) => !prev);
  };

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
    setShowChat(true); // 팝업 열기
  };

  useEffect(() => {
    if (newMessageAlert) {
      console.log("🔔 새 메시지 알림:", newMessageAlert);
      setShowNotification(true);

      // 5초 후 알림 사라지게 하기
      setTimeout(() => {
        setShowNotification(false);
        setNewMessageAlert(null);
      }, 5000);
    }
  }, [newMessageAlert, setNewMessageAlert]);

  const handleDeleteChat = (roomId) => {
    if (!window.confirm("정말로 이 채팅방을 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/chat/room/${roomId}`)
      .then(() => {
        alert("채팅방이 삭제되었습니다.");
        setChatRooms((prevRooms) =>
          prevRooms.filter((room) => room.roomId !== roomId)
        );
        if (activeRoomId === roomId) {
          setActiveRoomId(null); // 삭제된 채팅방이 현재 활성화된 경우 닫기
        }
      })
      .catch((err) => {
        console.error("❌ 채팅방 삭제 실패:", err);
        alert("채팅방 삭제에 실패했습니다.");
      });
  };

  const handleLogout = async () => {
    try {
      console.log("🚀 로그아웃 요청을 보냄!");

      const normalToken = localStorage.getItem("normal_accessToken");
      const kakaoToken = localStorage.getItem("kakao_accessToken");

      let headers = {};
      if (normalToken) {
        headers.Authorization = `Bearer ${normalToken}`;
      } else if (kakaoToken) {
        headers.Authorization = `Bearer ${kakaoToken}`;
      }

      const response = await axios.post("/api/users/logout", {}, { headers });

      console.log("✅ 로그아웃 API 응답:", response);

      if (response.status === 200) {
        localStorage.removeItem("normal_accessToken");
        localStorage.removeItem("normal_refreshToken");
        localStorage.removeItem("kakao_accessToken");
        localStorage.removeItem("kakao_refreshToken");

        setLoginUser(null);
        setLogin(false);

        alert("로그아웃 성공!");
        navigate("/");
      } else {
        console.error("❌ 로그아웃 실패: 응답 상태", response.status);
      }
    } catch (error) {
      console.error("❌ 로그아웃 API 요청 실패:", error);
    }
  };

  console.log("📌 로그인한 유저 데이터:", loginUser);

  const profileUrl =
    localStorage.getItem("kakao_accessToken") && loginUser?.profileImage
      ? loginUser.profileImage // ✅ 카카오 유저는 URL 그대로 사용
      : loginUser?.profileImage
      ? // ? `http://localhost:8080/upload/${loginUser.profileImage}` // ✅ 일반 로그인 유저는 /upload/ 추가
        `${loginUser.profileImage}` // ✅ 일반 로그인 유저는 /upload/ 추가
      : "http://localhost:8080/images/default-image.png"; // ✅ 기본 이미지

  console.log("📌 유저 프로필 profileImage(sysFile):", loginUser?.profileImage);
  console.log("📌 유저 프로필 url:", profileUrl);

  const MyPageButton = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const isAdmin = loginUser?.role === "ROLE_ADMIN"; // ✅ 관리자 여부 확인

    return isLogin ? (
      <div
        className={`user-info ${isDropdownOpen ? "open" : ""}`}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <span className="user-name">
          {loginUser?.userName}님, Welcome!{" "}
          {localStorage.getItem("kakao_accessToken") ? "" : ""}
        </span>
        <FontAwesomeIcon icon={faSquareCaretDown} className="dropdown-icon" />{" "}
        <div className="user-dropdown">
          <div className="user-profile">
            <div
              className="profile-pic"
              style={{ backgroundImage: `url(${profileUrl})` }}
            ></div>

            <div className="user-details">
              <div className="user-name">{loginUser?.userName}</div>{" "}
              <div className="user-email">{loginUser?.email}</div>
            </div>
          </div>
          {/* <div className="actions">
            <div className="mypage-button" onClick={() => navigate("/mypage")}>
              마이페이지
            </div>
            <div className="logout-button" onClick={handleLogout}>
              로그아웃
            </div>
          </div> */}
          <div className="actions">
            {isAdmin ? ( // ✅ 관리자면 어드민 페이지 버튼
              <div
                className="mypage-button"
                onClick={() => navigate("/adminpage")}
              >
                어드민페이지
              </div>
            ) : (
              <div
                className="mypage-button"
                onClick={() => navigate("/mypage")}
              >
                마이페이지
              </div>
            )}
            <div className="logout-button" onClick={handleLogout}>
              로그아웃
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="team-button" onClick={() => navigate("/login")}>
        로그인
      </div>
    );
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  //    return isLogin ? (
  //     <div
  //       className={`user-info ${isDropdownOpen ? "open" : ""}`}
  //       onClick={() => setDropdownOpen(!isDropdownOpen)}
  //     >
  //       <span className="user-name">
  //         {loginUser?.userName}님, Welcome!
  //       </span>
  //       <FontAwesomeIcon icon={faSquareCaretDown} className="dropdown-icon" />
  //       <div className="user-dropdown">
  //         <div className="user-profile">
  //           <div
  //             className="profile-pic"
  //             style={{ backgroundImage: `url(${profileUrl})` }}
  //           ></div>

  //           <div className="user-details">
  //             <div className="user-name">{loginUser?.userName}</div>
  //             <div className="user-email">{loginUser?.email}</div>
  //           </div>
  //         </div>
  //         <div className="actions">
  //           {isAdmin ? ( // ✅ 관리자면 어드민 페이지 버튼
  //             <div className="mypage-button" onClick={() => navigate("/adminpage")}>
  //               어드민페이지
  //             </div>
  //           ) : (
  //             <div className="mypage-button" onClick={() => navigate("/mypage")}>
  //               마이페이지
  //             </div>
  //           )}
  //           <div className="logout-button" onClick={handleLogout}>
  //             로그아웃
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   ) : (
  //     <div className="team-button" onClick={() => navigate("/login")}>
  //       로그인
  //     </div>
  //   );
  // };

  function SearchButton() {
    const searchButtonRef = useRef(null);
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);
    const [word, setWord] = useState("");
    const [category, setCategory] = useState("all");

    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(true);
        return;
      }
      // 검색어와 카테고리를 URL 파라미터로 전달
      navigate(`/search?category=${category}&query=${word}`);
    };

    return status ? (
      <div className="header-search-input-box">
        <input
          className="header-search-input"
          type="text"
          placeholder="검색어를 입력해주세요."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && searchButtonRef.current?.click()
          }
        />
        <div
          ref={searchButtonRef}
          className="icon-button"
          onClick={onSearchButtonClickHandler}
        >
          <div className="icon search-light-icon"></div>
        </div>
      </div>
    ) : (
      <div className="icon-button" onClick={onSearchButtonClickHandler}>
        <div className="icon search-light-icon"></div>
      </div>
    );
  }

  return (
    <>
      <div id="header">
        <div className="header-container">
          <div
            className="header-left-box"
            onClick={() => navigate(MAIN_PATH())}
          >
            <div className="icon-box">
              <div className="icon logo-main-icon"></div>
            </div>
            <div
              className="header-center-box"
              onClick={() => navigate(MAIN_PATH())}
            >
              <div className="header-logo">{"AroundMe"}</div>
            </div>
          </div>
          <div className="header-right-box">
            <SearchButton navigate={navigate} />
            <MyPageButton />
          </div>
        </div>
        <div className="header-main-menu">
          <ul className="menu">
            <li>
              <Link to="/">페이지소개</Link>
              <ul className="dropdown">
                <li>
                  <Link to="#">인사말</Link>
                </li>
                <li>
                  <Link to="#">사용가이드</Link>
                </li>
                <li>
                  <Link to="/board/notice">공지사항</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/circle">모임/참여</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/circle">모임 보기</Link>
                </li>
                <li>
                  <Link to="/circle/new">모임 개설하기</Link>
                </li>
                <li>
                  <Link to="#">지역별 활동량</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/board/freeboard">커뮤니티</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/board/freeboard">자유게시판</Link>
                </li>
                <li>{/* <Link to="/board/anonymous">익명게시판</Link> */}</li>
              </ul>
            </li>
            <li>
              <Link to="/market">중고거래</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/market">상품 보기</Link>
                </li>
                <li>
                  <Link to="/market/insert">상품 등록하기</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/service">고객센터</Link>
              <ul className="dropdown">
                <li>
                  <Link to="/board/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/board/qna">문의하기</Link>
                </li>
                <li>
                  <Link to="/board/improvement">사이트 불편&개선사항</Link>
                </li>
                <li>
                  <Link to="/board/report">신고하기</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      {/* 로그인한 경우에만 헤더에 채팅 아이콘 표시 */}
      {isLogin && (
        <div className="chat-icon" onClick={toggleChatPopup}>
          <FontAwesomeIcon icon={faComments} size="2x" />
          {unreadCount > 0 && <span className="chat-badge">{unreadCount}</span>}
        </div>
      )}
      {/* 채팅 팝업창: showChat이 true일 때 작게 띄움 */}
      {isLogin && showChat && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <span>채팅방 목록</span>
            <button onClick={toggleChatPopup}>X</button>
          </div>
          <div className="chat-popup-body">
            {chatRooms.length === 0 ? (
              <p>참여 중인 채팅방이 없습니다.</p>
            ) : (
              <ul>
                {chatRooms.map((room) => {
                  const isSeller = room.sellerId === loginUser?.userId;
                  const displayName = isSeller
                    ? `구매자: ${room.buyerName}`
                    : `판매자: ${room.sellerName}`;

                  return (
                    <li
                      key={room.roomId}
                      style={{
                        cursor: "pointer",
                        padding: "8px",
                        borderBottom: "1px solid #ccc",
                        backgroundColor:
                          room.roomId === activeRoomId ? "#eee" : "transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span onClick={() => handleSelectRoom(room.roomId)}>
                        {displayName}
                      </span>
                      <button
                        className="chat-delete-button"
                        onClick={() => handleDeleteChat(room.roomId)}
                        style={{
                          marginLeft: "10px",
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "5px",
                          cursor: "pointer",
                        }}
                      >
                        삭제
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {/* 선택된 채팅방이 있다면 채팅룸 표시 */}
            {activeRoomId && (
              <div style={{ marginTop: "10px" }}>
                <ChatRoomPopup
                  roomId={activeRoomId}
                  currentUserId={loginUser?.userId}
                  currentUserName={loginUser?.userName}
                />
              </div>
            )}
            {newMessageAlert && (
              <div className="chat-notification">
                <p>
                  <strong>{newMessageAlert.senderName}</strong>:{" "}
                  {newMessageAlert.content}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
