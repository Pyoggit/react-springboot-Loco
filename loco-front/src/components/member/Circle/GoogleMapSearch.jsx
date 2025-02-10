import React, { useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 37.5665, // 기본 위치 (서울)
  lng: 126.978,
};

const GoogleMapSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(center);

  const handleSearch = async () => {
    if (!searchQuery) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        setLocation({ lat: lat(), lng: lng() });
      } else {
        alert('주소를 찾을 수 없습니다. 다시 시도해주세요.');
      }
    });
  };

  return (
    <div className="map-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="주소를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>

      <p>검색된 주소 위치: {searchQuery}</p>
    </div>
  );
};

export default GoogleMapSearch;
