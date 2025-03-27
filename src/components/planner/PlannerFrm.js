import { useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./planner.css";
import { Close, Search } from "@mui/icons-material";
import { IconButton, InputBase, Menu, Paper } from "@mui/material";

const PlannerFrm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [planWindow, setPlanwindow] = useState(true);

  const markerPosition = {
    lat: 37.5341338,
    lng: 126.897333254,
  };
  const mapRef = useRef(null);
  // const map = mapRef.current;
  // console.log(map);
  // console.log(map.getCenter());

  const testList = new Array(10).fill("");

  return (
    <div className="all-wrap">
      <div className="side-wrap">
        <div className="side-header">
          <div className="search-wrap">
            <CustomizedInputBase />
          </div>
          <div className="filter-wrap">
            <div>숙소ㅋㅋ</div>
            <div>식당</div>
            <div>즐길거리</div>
          </div>
          <div className="sort-wrap">
            <select>
              <option>거리순</option>
              <option>리뷰많은순</option>
              <option>이름순</option>
            </select>
          </div>
        </div>
        <div className="spot-list">
          {testList.map(() => {
            return <TestItem />;
          })}
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
            height: "100%",
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

const CustomizedInputBase = () => {
  return (
    <Paper
      component="form"
      sx={{ margin: "10px", display: "flex", alignItems: "center" }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <Menu />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: "12px" }}
        placeholder="여행지, 즐길거리 등"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => {
          console.log("hi");
        }}
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

const TestItem = () => {
  return (
    <div className="spot-item">
      <img
        className="spot-img"
        src="https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDExMDFfMTI3%2FMDAxNzMwNDIxNzMwOTk2.XIgrsfQZKau5dz1vICaytYVlbmnJvLOM0DxRt3HkGkYg.JF5wL5dOJ2ROsjxltR8Y-h4gQ3NOhk-7PMElB2F4pakg.JPEG%2F1000052381.jpg.jpg&type=f&size=340x180&quality=80&opt=2"
        alt="테스트"
      />
      <div className="spot-title">
        <span className="spot-name">플라워랜드</span>
        <span className="spot-class">식당</span>
      </div>
      <div className="spot-address">대전광역시 중구 사정공원로 70</div>
      <div className="spot-review">
        <span>리뷰</span>
        <span>23</span>
      </div>
      <div className="spot-btn">
        <button>선택</button>
      </div>
    </div>
  );
};

export default PlannerFrm;
