import "./style.css";

export default function Footer() {
  const onInstaIconButtonClickHandler = () => {
    window.open("http://www.instagram.com");
  };

  const onNaverBlogIconButtonClickHandler = () => {
    window.open("http://blog.naver.com");
  };

  return (
    <div id="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-box">
            <div className="icon-box">
              <div className="icon logo-main-icon"></div>
            </div>
            <div className="footer-logo-text">{"AroundMe"}</div>
          </div>
          <div className="footer-link-box">
            <div className="footer-call-link">{"02-1234-5678"}</div>
            <div
              className="icon-button"
              onClick={onInstaIconButtonClickHandler}
            >
              <div className="icon insta-icon"></div>
            </div>
            <div
              className="icon-button"
              onClick={onNaverBlogIconButtonClickHandler}
            >
              <div className="icon naver-blog-icon"></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">
            {"Copyright © 2025 aroundMe. All Rights Reserved."}
          </div>
        </div>
      </div>
    </div>
  );
}
