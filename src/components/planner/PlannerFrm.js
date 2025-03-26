import { useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./planner.css";
import { Close } from "@mui/icons-material";

const PlannerFrm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [planWindow, setPlanwindow] = useState(true);

  const markerPosition = {
    lat: 37.5341338,
    lng: 126.897333254,
  };
  const mapRef = useRef(null);
  const map = mapRef.current;
  //   console.log(map);
  //   console.log(map.getCenter());

  return (
    <div className="all-wrap">
      <div className="side-wrap">
        <div className="result-wrap">
          <div className="search-wrap"></div>
          <div className="filter-wrap"></div>
          <div className="spot-wrap"></div>
        </div>
      </div>
      {planWindow ? (
        <div className="plan-window">
          <Close
            className="close-btn"
            onClick={() => {
              setPlanwindow(false);
            }}
          />
        </div>
      ) : (
        <div
          className="plan-window-btn"
          onClick={() => {
            setPlanwindow(true);
          }}
        >
          <span>📆</span>
          <p>계획표</p>
        </div>
      )}
      <div className="map-wrap">
        <Map // 지도를 표시할 Container
          id={`kakaomap`}
          ref={mapRef}
          center={{
            // 지도의 중심좌표
            lat: 37.5341338,
            lng: 126.897333254,
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "800px",
          }}
          level={3} // 지도의 확대 레벨
        >
          <MapMarker
            position={markerPosition}
            onClick={() => setIsOpen(true)}
          />
          {isOpen && (
            <CustomOverlayMap position={markerPosition}>
              <div className="overlay-wrap">
                <div className="overlay-info">
                  <div className="overlay-title">
                    KH 정보교육원 당산지원
                    <div
                      className="overlay-close"
                      onClick={() => setIsOpen(false)}
                      title="닫기"
                    >
                      <Close />
                    </div>
                  </div>
                  <div className="overlay-body">
                    <div className="overlay-img">
                      <img
                        src="https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/localfiy/D30EC4B18F484C6F9F4AA23D421DDF30"
                        width="73"
                        height="70"
                        alt="카카오 스페이스닷원"
                      />
                    </div>
                    <div className="overlay-desc">
                      <div className="overlay-ellipsis">
                        서울 영등포구 선유동2로 57 이레빌딩 19-20층
                      </div>
                      <div className="jibun overlay-ellipsis">
                        (지번) 양평동4가 2
                      </div>
                      <div>
                        <a
                          href="https://kh-academy.co.kr/main/main.kh"
                          target="_blank"
                          className="overlay-link"
                          rel="noreferrer"
                        >
                          홈페이지
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CustomOverlayMap>
          )}
        </Map>
      </div>
    </div>
  );
};

export default PlannerFrm;
