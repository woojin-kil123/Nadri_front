import { useRef, useState } from "react";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./planner.css";
import { Close, Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";

const PlannerFrm = () => {
  //마커 오버레이 여닫음 state
  const [openOverlay, setOpenOverlay] = useState(null);

  //플래너 창 여닫음 state
  const [planWindow, setPlanwindow] = useState(false);

  //"플래너에 추가하기" 창 여닫음 state
  const [openPlanningModal, setOpenPlanningModal] = useState(null);

  //플래너에 추가한 장소 리스트 state
  const [plannedSpot, setPlannedSpot] = useState([
    {
      dayDate: "",
      startLocation: "",
      transport: "",
      endLocation: "",
      order: "",
    },
  ]);
  const handleAddSpot = (content) => {
    const newSpot = {
      dayDate: "",
      startLocation: "",
    };
    setPlannedSpot([...plannedSpot, content]);
  };

  //장소 리스트(임시 데이터)
  const [contentList, setContentList] = useState([
    {
      contentThumb:
        "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDExMDFfMTI3%2FMDAxNzMwNDIxNzMwOTk2.XIgrsfQZKau5dz1vICaytYVlbmnJvLOM0DxRt3HkGkYg.JF5wL5dOJ2ROsjxltR8Y-h4gQ3NOhk-7PMElB2F4pakg.JPEG%2F1000052381.jpg.jpg&type=f&size=340x180&quality=80&opt=2",
      contentTitle: "플라워랜드",
      contentType: "즐길거리",
      contentAddr: "대전광역시 중구 사정공원로 70",
      contentReview: 1034,
      contentRating: 4.52,
      contentLatLng: {
        lat: 37.5358124,
        lng: 126.8952968,
      },
    },
    {
      contentThumb:
        "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDExMDFfMTI3%2FMDAxNzMwNDIxNzMwOTk2.XIgrsfQZKau5dz1vICaytYVlbmnJvLOM0DxRt3HkGkYg.JF5wL5dOJ2ROsjxltR8Y-h4gQ3NOhk-7PMElB2F4pakg.JPEG%2F1000052381.jpg.jpg&type=f&size=340x180&quality=80&opt=2",
      contentTitle: "행복양꼬치",
      contentType: "음식점",
      contentAddr: "서을특별시 은평구 구산동 역말로 47",
      contentReview: 123,
      contentRating: 3.12,
      contentLatLng: {
        lat: 37.5355274,
        lng: 126.8991667,
      },
    },
    {
      contentThumb:
        "https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDExMDFfMTI3%2FMDAxNzMwNDIxNzMwOTk2.XIgrsfQZKau5dz1vICaytYVlbmnJvLOM0DxRt3HkGkYg.JF5wL5dOJ2ROsjxltR8Y-h4gQ3NOhk-7PMElB2F4pakg.JPEG%2F1000052381.jpg.jpg&type=f&size=340x180&quality=80&opt=2",
      contentTitle: "KH정보교육원 당산지원",
      contentType: "숙박시설",
      contentAddr: "서울특별시 영등포구 선유동2로 57 이레빌딩 19층",
      contentReview: 54,
      contentRating: 1.7,
      contentLatLng: {
        lat: 37.53378661113698,
        lng: 126.89695153857365,
      },
    },
  ]);

  //추후 사용할 지도 시작 위치(가운데 좌표)
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0,
  });

  return (
    <div className="all-wrap">
      <div className="side-wrap">
        <div className="side-header">
          <div className="search-wrap">
            <CustomizedInputBase />
          </div>
          <div className="filter-wrap">
            <div>숙박시설</div>
            <div>음식점</div>
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
          {contentList.map((content, idx) => {
            return (
              <PrintSpotList
                key={"spot-" + idx}
                content={content}
                idx={idx}
                handleAddSpot={handleAddSpot}
                openPlanningModal={openPlanningModal}
                setOpenPlanningModal={setOpenPlanningModal}
              />
            );
          })}
        </div>
      </div>
      {planWindow ? (
        <Planner
          setPlanwindow={setPlanwindow}
          plannedSpot={plannedSpot}
          setPlannedSpot={setPlannedSpot}
        />
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
        <PrintMap
          contentList={contentList}
          setContentList={setContentList}
          openOverlay={openOverlay}
          setOpenOverlay={setOpenOverlay}
        />
      </div>
    </div>
  );
};

// 검색 창
const CustomizedInputBase = () => {
  return (
    <Paper
      component="form"
      sx={{ margin: "10px", display: "flex", alignItems: "center" }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu"></IconButton>
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

// 장소 데이터 출력 창
const PrintSpotList = (props) => {
  const content = props.content;
  const idx = props.idx;
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];

  return (
    <div className="spot-item">
      <img className="spot-img" src={content.contentThumb} alt="테스트" />
      <div className="spot-title-wrap">
        <span className="spot-title">{content.contentTitle}</span>
        <span className="spot-type">{content.contentType}</span>
      </div>
      <div className="spot-addr spot-ellipsis">{content.contentAddr}</div>
      <div className="spot-review-wrap">
        <div>
          <StarRating rating={content.contentRating} />
          <span className="spot-rating-avg">{content.contentRating}</span>
        </div>
        <div>
          <span>리뷰</span>
          <span className="spot-review-count">
            {content.contentReview > 999 ? "999+" : content.contentReview}
          </span>
        </div>
      </div>
      <div className="spot-btn">
        <button onClick={() => setOpenPlanningModal(idx)}>선택</button>
      </div>
      {openPlanningModal === idx && (
        <PlanningModal
          openPlanningModal={openPlanningModal}
          setOpenPlanningModal={setOpenPlanningModal}
          content={content}
        />
      )}
    </div>
  );
};

// 리뷰 평점으로 별 채우기
const StarRating = ({ rating }) => {
  const percentage = (rating / 5) * 100;

  return (
    <div className="star-rating">
      <div className="back-stars">★★★★★</div>
      <div className="front-stars" style={{ width: `${percentage}%` }}>
        ★★★★★
      </div>
    </div>
  );
};

// 여행 플래너 출력 창
const Planner = (props) => {
  const setPlanwindow = props.setPlanwindow;
  const [plannedSpot, setPlannedSpot] = [
    props.plannedSpot,
    props.setPlannedSpot,
  ];
  return (
    <div className="plan-window">
      <Close className="close-btn" onClick={() => setPlanwindow(false)} />
      <div className="plan-window-content">
        {plannedSpot.map((content, idx) => {
          return (
            <div className="planned-item" key={"planned-" + idx}>
              <img
                className="planned-img"
                src={content.contentThumb}
                alt="테스트"
                width="50px"
                height="50px"
              />
              <div className="spot-item">
                <div className="spot-title-wrap">
                  <span className="spot-title">{content.contentTitle}</span>
                  <span className="spot-type">{content.contentType}</span>
                </div>
                <div className="spot-addr spot-ellipsis">
                  {content.contentAddr}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// "여행지에 추가하기" 모달 창
const PlanningModal = (props) => {
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];
  const content = props.content;

  return (
    <div className="modal-background">
      <div className="planning-modal">
        <div className="planning-header">여행지에 추가하기</div>
        <Close
          onClick={() => setOpenPlanningModal(null)}
          className="close-btn"
        />
        <div className="planning-info">
          <img
            className="planned-img"
            src={content.contentThumb}
            alt="테스트"
            width="50px"
            height="50px"
          />
          <div className="spot-item">
            <div className="spot-title-wrap">
              <span className="spot-title">{content.contentTitle}</span>
              <span className="spot-type">{content.contentType}</span>
            </div>
            <div className="spot-addr">{content.contentAddr}</div>
          </div>
        </div>
      </div>
      <div className="planning-input">
        <div className="spot-btn">
          <button>추가</button>
        </div>
      </div>
    </div>
  );
};

const PrintMap = (props) => {
  const [contentList, setContentList] = [
    props.contentList,
    props.setContentList,
  ];
  const [openOverlay, setOpenOverlay] = [
    props.openOverlay,
    props.setOpenOverlay,
  ];

  return (
    <Map // 지도를 표시할 Container
      id={`kakaomap`}
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
      //좌표 추출 임시툴
      onClick={(map, e) => {
        console.log(e.latLng.getLat() + " " + e.latLng.getLng());
      }}
      onCreate={(map) => {
        console.log(map.getCenter());
      }}
    >
      {contentList.map((spot, idx) => {
        return (
          <div key={"marker-" + idx}>
            <MapMarker
              position={spot.contentLatLng}
              onClick={() => setOpenOverlay(idx)}
            />
            {openOverlay === idx && (
              <CustomOverlayMap position={spot.contentLatLng}>
                <div className="overlay-wrap">
                  <div className="overlay-info">
                    <div className="overlay-title">
                      <div className="overlay-title-name">
                        {spot.contentTitle}
                        <span className="overlay-class">
                          {spot.contentType}
                        </span>
                      </div>
                      <div
                        className="overlay-close"
                        onClick={() => setOpenOverlay(null)}
                        title="닫기"
                      >
                        <Close />
                      </div>
                    </div>
                    <div className="overlay-body">
                      <div className="overlay-img">
                        <img
                          // src="https://t1.daumcdn.net/thumb/C84x76/?fname=http://t1.daumcdn.net/localfiy/D30EC4B18F484C6F9F4AA23D421DDF30"
                          src={spot.contentThumb}
                          width="85"
                          height="80"
                          alt={spot.contentTitle}
                        />
                      </div>
                      <div className="overlay-desc">
                        <div className="overlay-addr">{spot.contentAddr}</div>
                        <div className="overlay-rating">
                          <StarRating rating={spot.contentRating} />
                          <span>
                            ({" "}
                            {spot.contentReview > 999
                              ? "999+"
                              : spot.contentReview}{" "}
                            )
                          </span>
                        </div>
                        <div className="overlay-below">
                          <div
                            className="overlay-link"
                            // href="#"
                            // target="_blank"
                            // rel="noreferrer"
                          >
                            상세보기
                          </div>
                          <div className="spot-btn">
                            <button onClick={() => {}}>추가</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CustomOverlayMap>
            )}
          </div>
        );
      })}
    </Map>
  );
};

export default PlannerFrm;
