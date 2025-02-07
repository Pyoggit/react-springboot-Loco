import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const mockData = [
  {
    id: 1,
    name: '상품1',
    image: '이미지1',
    category: '카테고리a',
    content: '설명1',
    price: 1000,
  },
  {
    id: 2,
    name: '상품2',
    image: '이미지2',
    category: '카테고리b',
    content: '설명2',
    price: 2000,
  },
  {
    id: 3,
    name: '상품3',
    image: '이미지3',
    category: '카테고리c',
    content: '설명3',
    price: 3000,
  },
  {
    id: 4,
    name: '상품4',
    image: '이미지4',
    category: '카테고리d',
    content: '설명4',
    price: 4000,
  },
  {
    id: 5,
    name: '상품5',
    image: '이미지5',
    category: '카테고리e',
    content: '설명5',
    price: 5000,
  },
  {
    id: 6,
    name: '상품6',
    image: '이미지6',
    category: '카테고리f',
    content: '설명6',
    price: 6000,
  },
];

const ProductInfo = () => {
  const params = useParams();
  const nav = useNavigate();
  const [curBoardItem, setCurBoardItem] = useState(null);

  useEffect(() => {
    const currentBoardItem = mockData.find(
      (item) => String(item.id) === String(params.id)
    );

    if (!currentBoardItem) {
      window.alert('존재하지 않는 상품입니다.');
      nav('/', { replace: true });
      return;
    }

    setCurBoardItem(currentBoardItem);
  }, [params.id, nav]);

  if (!curBoardItem) {
    return <div>데이터 로딩중...!</div>;
  }

  return (
    <div className="board">
      <h1>상세보기</h1>
      <div className="boardView">
        <div className="table">
          <table>
            <thead>
              <tr>
                <td colSpan={2}>
                  <strong>{curBoardItem.name}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="image">
                  <img src={curBoardItem.image} alt={curBoardItem.name} />
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>카테고리: {curBoardItem.category}</td>
              </tr>
              <tr>
                <td colSpan={2}>{curBoardItem.content}</td>
              </tr>
              <tr>
                <td>가격 : {curBoardItem.price.toLocaleString()}원</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button">
          <button onClick={() => nav(-1)}>뒤로가기</button>
          <button onClick={() => nav(`/payment/${curBoardItem.id}`)}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
