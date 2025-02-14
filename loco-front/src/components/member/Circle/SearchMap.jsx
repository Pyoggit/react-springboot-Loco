import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchMap() {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const mapRef = useRef(null);

  // 주소 입력 값 변경
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // 좌표 검색 함수
  const searchCoordinates = async () => {
    if (!address) {
      alert('주소를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/geocode', {
        address,
      });
      setCoordinates(response.data); // 좌표 업데이트
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };
  // 좌표가 변경되면 지도 초기화
  useEffect(() => {
    if (coordinates) {
      const { lat, lng } = coordinates;

      // Google Map 초기화
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 15,
      });

      // 마커 추가
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: '검색된 위치',
      });
    }
  }, [coordinates]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Google Maps 주소 검색</h1>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="주소를 입력하세요"
        className="border p-2 w-full mb-4"
      />
      <button onClick={searchCoordinates}>검색</button>

      {coordinates && (
        <div className="mt-4">
          <h2>위도: {coordinates.lat}</h2>
          <h2>경도: {coordinates.lng}</h2>
        </div>
      )}

      {/* 지도 표시 영역 */}
      <div ref={mapRef} className="h-96 w-full mt-4 border" />
    </div>
  );
}
