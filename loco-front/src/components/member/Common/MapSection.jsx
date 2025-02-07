import { useEffect } from "react";
import "@/css/member/common/MapSection.css";

const MapSection = ({ LATITUDE, LONGITUDE }) => {
  useEffect(() => {
    const clientId = import.meta.env.VITE_APP_NAVER_MAPS_CLIENT_ID;

    if (!clientId) {
      console.error("네이버 지도 API Client ID가 설정되지 않았습니다.");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${clientId}`;
    script.async = true;
    script.onload = () => {
      if (window.naver) {
        const map = new window.naver.maps.Map("naver-map", {
          center: new window.naver.maps.LatLng(LATITUDE, LONGITUDE),
          zoom: 15,
        });

        // 📍 마커 추가
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(LATITUDE, LONGITUDE),
          map: map,
        });
      }
    };
    document.head.appendChild(script);
  }, [LATITUDE, LONGITUDE]);

  return (
    <div className="map-section">
      <div id="naver-map"></div>
    </div>
  );
};

export default MapSection;
