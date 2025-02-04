import CalendarNavigation from './CalendarNavigation';
import './css/CalendarNavigation.css'; // 스타일 파일 연결
import './css/CalendarButton.css';
import './CircleMain.css';
import CircleCategory from './CircleCategory';
import CircleList from './CircleList';

const CircleMain = () => {
  const mockPosts = [
    {
      id: 1,
      createdDate: new Date('2025-01-19').getTime(),
      title: '축구 동아리 모임',
      time: '18:00',
      description: '수원 누누풋살장에서 모여요!',
    },
    {
      id: 2,
      createdDate: new Date('2025-01-19').getTime(),
      title: '요리 클래스 모집',
      time: '14:00',
      description: '건강식을 함께 요리해요.',
    },
    {
      id: 3,
      createdDate: new Date('2025-04-19').getTime(),
      title: '사진 크루 모집',
      time: '14:00',
      description: '같이 이쁜 사진 찍어요~.',
    },
    {
      id: 4,
      createdDate: new Date('2025-05-20').getTime(),
      title: '반려 동물 키우는 사람!?',
      time: '19:30',
      description: '반려동물 키우시는 분 같이 산책합시다.',
    },
    {
      id: 5,
      createdDate: new Date('2025-08-10').getTime(),
      title: '이번주 목요일 같이 등산 하실분?',
      time: '19:30',
      description: '모임장소는 광교산 입니다 ',
    },
    {
      id: 6,
      createdDate: new Date('2025-01-24').getTime(),
      title: '더이상 생각 나지 않아.',
      time: '19:30',
      description: '예시일뿐',
    },
    {
      id: 7,
      createdDate: new Date('2025-11-20').getTime(),
      title: '무슨 모임일까?',
      time: '19:30',
      description: '모임추천 받아요',
    },
    {
      id: 8,
      createdDate: new Date('2025-08-26').getTime(),
      title: '현대건설 팬분들중 이번주 토요일 배구보러 가실분(진짜 갑니다.)',
      time: '19:30',
      description:
        '이번주 주말 현대건설배구단과 흥국생명 배구단 맞대결 같이 수원 종합운동장 가실 분 구합니다. 진짜로요',
    },
  ];

  return (
    <>
      <main className="main-layout">
        <div className="content-section">
          <CalendarNavigation />
          <CircleList />
          <div className="mock-post-container">
            {mockPosts.map((post) => (
              <div key={post.id} className="post-card">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-date">
                  📅{' '}
                  {new Date(post.createdDate).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </p>
                <p className="post-time">🕒 {post.time}</p>
                <p className="post-description">{post.description}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="category-section">
          <CircleCategory />
        </aside>
      </main>
    </>
  );
};

export default CircleMain;
