import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./style.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAuthPage, setAuthPage] = useState(false);
  const [isMainPage, setMainPage] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  const onLogoClickHandler = () => {
    navigate("/");
  };

  const LOGIN_PATH = () => "/member/Sign/LoginMain";
  const MAIN_PATH = () => "/";
  const USER_PATH = (userEmail) => `/user/${userEmail}`;

  useEffect(() => {
    setAuthPage(pathname.startsWith(LOGIN_PATH()));
    setMainPage(pathname === MAIN_PATH());
  }, [pathname]);

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

  return (
    <div id="header">
      <div className="header-container">
        <div className="header-left-box" onClick={onLogoClickHandler}>
          <div className="icon-box">
            <div className="icon logo-main-icon"></div>
          </div>
          <div className="header-logo">{"Loco"}</div>
        </div>
        <div className="header-right-box">
          <MyPageButton />
        </div>
      </div>
      <div className="header-main-menu">
        <ul className="menu">
          <li>
            <a href="#">페이지소개</a>
            <ul className="dropdown">
              <li>
                <a href="#">종합안내</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">모임/참여</a>
            <ul className="dropdown">
              <li>
                <a href="#">스포츠</a>
              </li>
              <li>
                <a href="#">맛집탐방</a>
              </li>
              <li>
                <a href="#">독서</a>
              </li>
              <li>
                <a href="#">친목</a>
              </li>
              <li>
                <a href="#">전시</a>
              </li>
              <li>
                <a href="#">취미활동</a>
              </li>
              <li>
                <a href="#">스터디</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">커뮤니티</a>
            <ul className="dropdown">
              <li>
                <a href="#">공지사항</a>
              </li>
              <li>
                <a href="#">자유게시판</a>
              </li>
              <li>
                <a href="#">리뷰</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">공구몰</a>
            <ul className="dropdown">
              <li>
                <a href="#">스포츠</a>
              </li>
              <li>
                <a href="#">스터디</a>
              </li>
              <li>
                <a href="#">의류</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="#">고객센터</a>
            <ul className="dropdown">
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">판매자등록문의</a>
              </li>
              <li>
                <a href="#">사이트 불편&개선사항</a>
              </li>
              <li>
                <a href="#">기타문의</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
