import React from "react";
import "@/css/member/common/GreetingPage.css";

const GreetingPage = () => {
  return (
    <div className="greeting-container">
      <h1>환영합니다! 😊</h1>
      <p>
        저희 프로젝트 <strong>AroundMe</strong>에 방문해주셔서 감사합니다.
      </p>
      <p>
        이 프로젝트는 사람들이 쉽게 모임을 개설하고 참여할 수 있도록 돕기 위해
        만들어졌습니다. <br /> 스터디, 운동, 친목, 취미 활동 등 다양한 모임을
        통해 사람들이 만나고 소통하며 의미 있는 시간을 보낼 수 있도록
        설계되었습니다.
      </p>

      <h2>우리의 목표</h2>
      <ul>
        <li> 쉽고 빠르게 모임을 찾고 개설할 수 있도록</li>
        <li> 관심사 기반의 커뮤니티를 형성할 수 있도록</li>
        <li> 안전하고 신뢰할 수 있는 플랫폼을 제공하도록</li>
      </ul>

      <h2>앞으로의 계획</h2>
      <p>
        우리는 지속적인 업데이트를 통해 더 많은 기능을 추가하고, 사용자 경험을
        향상시킬 계획입니다. 더 나은 커뮤니티를 위한 피드백도 언제든지
        환영합니다!
      </p>
      <p>
        AroundMe가 여러분의 새로운 만남과 즐거운 경험을 만들어가길 기대합니다.
      </p>

      <p>
        <strong>감사합니다! 💙</strong>
      </p>
    </div>
  );
};

export default GreetingPage;
