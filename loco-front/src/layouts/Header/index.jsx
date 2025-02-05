import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import "./style.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [cookies] = useCookies(["loginUser"]);

  const [isAuthPage, setAuthPage] = useState(false);
  const [isMainPage, setMainPage] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const [isSearchPage, setSearchPage] = useState(false);

  const MAIN_PATH = () => "/";
  const LOGIN_PATH = () => "/login";
  const SEARCH_PATH = () => "/search";
  const USER_PATH = (userEmail) => `/user/${userEmail}`;

  useEffect(() => {
    setAuthPage(pathname.startsWith(LOGIN_PATH()));
    setMainPage(pathname === MAIN_PATH());
    setSearchPage(pathname.startsWith(SEARCH_PATH()));

    // 로그인 유지 처리
    if (cookies.loginUser) {
      setLogin(true);
      setLoginUser(cookies.loginUser);
    }
  }, [pathname, cookies.loginUser]);

  const resetLoginUser = () => {
    setLoginUser(null);
    setLogin(false);
  };

  const MyPageButton = () => {
    const { userEmail } = useParams();

    const onMyPageButtonClickHandler = () => {
      if (!loginUser) return;
      navigate(USER_PATH(loginUser.email));
    };

    const onSignOutButtonClickHandler = () => {
      resetLoginUser();
      navigate(MAIN_PATH());
    };

    const onSignInButtonClickHandler = () => {
      navigate(LOGIN_PATH());
    };

    if (isLogin && userEmail === loginUser?.email) {
      return (
        <div className="white-button" onClick={onSignOutButtonClickHandler}>
          {"로그아웃"}
        </div>
      );
    }
    if (isLogin) {
      return (
        <div className="white-button" onClick={onMyPageButtonClickHandler}>
          {"마이페이지"}
        </div>
      );
    }
    return (
      <div className="black-button" onClick={onSignInButtonClickHandler}>
        {"로그인"}
      </div>
    );
  };

  function SearchButton({ navigate }) {
    const searchButtonRef = useRef(null);
    const [status, setStatus] = useState(false);
    const [word, setWord] = useState("");
    const { searchWord } = useParams();

    useEffect(() => {
      if (searchWord) {
        setWord(searchWord);
        setStatus(true);
      }
    }, [searchWord]);

    const onSearchButtonClickHandler = () => {
      if (!status) {
        setStatus(true);
        return;
      }
      navigate(SEARCH_PATH());
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
    <div id="header">
      <div className="header-container">
        <div className="header-left-box" onClick={() => navigate(MAIN_PATH())}>
          <div className="icon-box">
            <div className="icon logo-main-icon"></div>
          </div>
          <div className="header-logo">{"Loco"}</div>
        </div>
        <div className="header-right-box">
          <SearchButton navigate={navigate} />
          {/* {(isAuthPage || isMainPage || isSearchPage) && (
            <SearchButton navigate={navigate} />
          )} */}
          <MyPageButton />
        </div>
      </div>
      <div className="header-main-menu">
        <ul className="menu">
          <li>
            <a href="#">페이지소개</a>
            <ul className="dropdown">
              <li>
                <a href="#">인사말</a>
              </li>
              <li>
                <a href="#">사용가이드</a>
              </li>
              <li>
                <a href="#">공지사항</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/circle">모임/참여</a>
            <ul className="dropdown">
              <li>
                <a href="#">모임 보기</a>
              </li>
              <li>
                <a href="#">모임 개설하기</a>
              </li>
              <li>
                <a href="#">지역별 활동량</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/board">커뮤니티</a>
            <ul className="dropdown">
              <li>
                <a href="#">자유게시판</a>
              </li>
              <li>
                <a href="#">익명게시판</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/market">중고거래</a>
            <ul className="dropdown">
              <li>
                <a href="/">상품 보기</a>
              </li>
              <li>
                <a href="#">상품 등록하기</a>
              </li>
              <li>
                <a href="#">장바구니</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/service">고객센터</a>
            <ul className="dropdown">
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">문의하기</a>
              </li>
              <li>
                <a href="#">사이트 불편&개선사항</a>
              </li>
              <li>
                <a href="#">신고하기</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
