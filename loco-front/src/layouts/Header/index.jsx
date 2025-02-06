import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
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
        <div className="team-button" onClick={onSignOutButtonClickHandler}>
          {"로그아웃"}
        </div>
      );
    }
    if (isLogin) {
      return (
        <div className="team-button" onClick={onMyPageButtonClickHandler}>
          {"마이페이지"}
        </div>
      );
    }
    return (
      <div className="team-button" onClick={onSignInButtonClickHandler}>
        {"로그인"}
      </div>
    );
  };

  function SearchButton({ navigate }) {
    const searchButtonRef = useRef(null);
    const [status, setStatus] = useState(false);
    const [word, setWord] = useState("");
    const { searchWord } = useParams();
    const [category, setCategory] = useState("all");

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
      navigate(`/search?category=${category}&query=${word}`);
    };

    return status ? (
      <div className="header-search-input-box">
        <select
          className="search-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="board">게시판</option>
          <option value="market">중고거래</option>
          <option value="club">모임</option>
        </select>

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
          <div
            className="header-center-box"
            onClick={() => navigate(MAIN_PATH())}
          >
            <div className="header-logo">{"AroundMe"}</div>
          </div>
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
            <Link to="#">페이지소개</Link>
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
                <Link to="#">모임 보기</Link>
              </li>
              <li>
                <Link to="#">모임 개설하기</Link>
              </li>
              <li>
                <Link to="#">지역별 활동량</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/board">커뮤니티</Link>
            <ul className="dropdown">
              <li>
                <Link to="/board/freeboard">자유게시판</Link>
              </li>
              <li>
                <Link to="/board/aanonymous">익명게시판</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/market">중고거래</Link>
            <ul className="dropdown">
              <li>
                <Link to="/">상품 보기</Link>
              </li>
              <li>
                <Link to="#">상품 등록하기</Link>
              </li>
              <li>
                <Link to="#">장바구니</Link>
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
  );
}
