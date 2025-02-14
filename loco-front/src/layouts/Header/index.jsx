import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import axios from "@/utils/AxiosConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faSquareCaretDown } from "@fortawesome/free-regular-svg-icons";
import ChatRoom from "@/components/member/Common/ChatRoom";
import "./style.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cookies, setCookie, removeCookie] = useCookies(["loginUser"]);
  const [isLogin, setLogin] = useState(false);
  const [isSearchPage, setSearchPage] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const MAIN_PATH = () => "/";
  const LOGIN_PATH = () => "/login";
  const SEARCH_PATH = () => "/search";
  // const USER_PATH = (userEmail) => `/user/${userEmail}`;
  // const USER_PATH = (userEmail) => `/mypage/${userEmail}`;
  const USER_PATH = () => "/mypage";

  useEffect(() => {
    const fetchUserInfo = async () => {
      // const token = localStorage.getItem("accessToken");
      const token = localStorage.getItem("normal_accessToken");
      if (!token) {
        removeCookie("loginUser", { path: "/" });
        setLogin(false);
        setLoginUser(null);
        setSearchPage(pathname.startsWith(SEARCH_PATH()));
        return;
      }

      try {
        const response = await axios.get("/api/users/mypage");
        console.log("📌 받은 유저 정보:", response.data);

        // ✅ 유저 정보가 다르면 업데이트, 같으면 업데이트 안 함
        if (!loginUser || loginUser.email !== response.data.email) {
          setLoginUser(response.data);
          setCookie("loginUser", response.data, { path: "/" });
          setLogin(true);
        }
      } catch (error) {
        console.error("유저 정보 가져오기 실패:", error);
        localStorage.removeItem("normal_accessToken");
        localStorage.removeItem("normal_refreshToken");
        removeCookie("loginUser", { path: "/" });
        setLogin(false);
        setLoginUser(null);
      }
    };

    fetchUserInfo();
  }, [pathname]); // ✅ `cookies.loginUser` 제거, `pathname`만 의존성으로 사용

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("normal_accessToken");
      if (!token) throw new Error("로그인 상태가 아닙니다.");

      await axios.post(
        "/api/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 로그아웃 성공 시 클라이언트 상태 초기화
      localStorage.removeItem("normal_accessToken");
      localStorage.removeItem("normal_refreshToken");
      removeCookie("loginUser", { path: "/" });
      setLoginUser(null);
      setLogin(false);
      alert("로그아웃 성공!");
      navigate(MAIN_PATH());
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  };

  const MyPageButton = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    //const { userEmail } = useParams();

    return isLogin ? (
      <div
        className={`user-info ${isDropdownOpen ? "open" : ""}`}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <span className="user-name">{loginUser?.userName}님, Welcome!</span>
        <FontAwesomeIcon
          icon={faSquareCaretDown}
          className="dropdown-icon"
        />{" "}
        <div className="user-dropdown">
          <div className="user-profile">
            <div
              className="profile-pic"
              style={{
                backgroundImage: `url(${
                  loginUser?.profileImage || "/default-profile.png"
                })`,
              }}
            ></div>
            <div className="user-details">
              <div className="user-name">{loginUser?.userName}</div>{" "}
              {/* ✅ user.name만 폰트 변경 */}
              <div className="user-email">{loginUser?.email}</div>
            </div>
          </div>
          <div className="actions">
            <div className="mypage-button" onClick={() => navigate("/mypage")}>
              마이페이지
            </div>
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
                <li>
                  <Link to="/board/anonymous">익명게시판</Link>
                </li>
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
        <div className="chat-icon" onClick={() => setShowChat(!showChat)}>
          <FontAwesomeIcon icon={faComments} size="2x" />
        </div>
      )}
      {/* 채팅 팝업창: showChat이 true일 때 작게 띄움 */}
      {isLogin && showChat && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <span>채팅</span>
            <button onClick={() => setShowChat(false)}>X</button>
          </div>
          <div className="chat-popup-body">
            <ChatRoom />
          </div>
        </div>
      )}
    </>
  );
}
