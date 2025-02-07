import emailjs from "emailjs-com";
import { useState } from "react";

function SendPwResult() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const sendVerificationEmail = () => {
    // 이메일 보내기
    // 여기서 정의해야하는 것은 위에서 만든 메일 템플릿에 지정한 변수({{ }})에 대한 값을 담아줘야한다.
    const templateParams = {
      // https://dashboard.emailjs.com/admin/templates/7kpnw9d 에서 To_Email부분을 바꿔야함함
      to_email: "jiyeonjeon0127@gmail.com",
      from_name: "find_pw",
      message: "임시 비밀번호를 보내드립니다.",
      pwResult: "", // 새로 만든 비밀번호 보여주기
    };

    emailjs
      .send(
        "fullstack-test", // 서비스 ID
        "fullstackTest_pwFind", // 템플릿 ID
        templateParams,
        "IMO_LTRDyk6Bvpf-A" // public-key
      )
      .then((response) => {
        console.log("이메일이 성공적으로 보내졌습니다:", response);
        setIsEmailSent(true);
        // 이메일 전송 성공 처리 로직 추가
      })
      .catch((error) => {
        console.error("이메일 보내기 실패:", error);
        // 이메일 전송 실패 처리 로직 추가
      });
  };

  const handleVerification = () => {
    sendVerificationEmail();
  };

  return (
    <div>
      <h2>이메일 인증</h2>
      {isEmailSent ? (
        <p>인증 이메일이 성공적으로 발송되었습니다. 이메일을 확인해주세요!</p>
      ) : (
        <button onClick={handleVerification}>인증</button>
      )}
    </div>
  );
}

export default SendPwResult;
