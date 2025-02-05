import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@/css/member/circle/NewCircle.css';

const NewCircle = ({ onAddCircle }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !date || !time || !description) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const newCircle = {
      id: Date.now(),
      createdDate: new Date(date).getTime(),
      title,
      time,
      description,
    };

    onAddCircle(newCircle);
  };

  return (
    <div className="new-circle-form-container">
      <h2>새로운 모임 추가</h2>
      <form onSubmit={handleSubmit} className="new-circle-form">
        <label>
          모임 제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="모임 제목을 입력하세요"
            required
          />
        </label>

        <label>
          날짜:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label>
          시간:
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>

        <label>
          모임 설명:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="모임 설명을 입력하세요"
            required
          />
        </label>

        <button type="button" className="submit-button">
          모임 추가
        </button>
      </form>
    </div>
  );
};

export default NewCircle;
