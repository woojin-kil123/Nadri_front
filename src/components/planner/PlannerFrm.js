import { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import "./planner.css";
import { CancelOutlined, Close, Delete, Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import StarRating from "../utils/StarRating";
import BasicDatePicker from "../utils/BasicDatePicker";
import BasicSelect from "../utils/BasicSelect";
import dayjs from "dayjs";
import axios from "axios";
import { Link } from "react-router-dom";

const PlannerFrm = () => {
  //마커 오버레이 여닫음 state
  const [openOverlay, setOpenOverlay] = useState(null);
  //플래너 창 여닫음 state
  const [openPlanner, setOpenPlanner] = useState(false);
  //"플래너에 추가하기" 창 여닫음 state
  const [openPlanningModal, setOpenPlanningModal] = useState(null);
  //플래너에 추가한 장소 리스트 state
  const [plannedSpotList, setPlannedSpotList] = useState([]);
  //현재 보이는 지도 화면 state
  const [mapBounds, setMapBounds] = useState(null);
  //유저가 클릭한 지도 위치 state
  const [userMarker, setUserMarker] = useState(null);
  //유저 클릭 위치를 중심으로 하는 반경 범위
  const [userRadius, setUserRadius] = useState(1000);
  //장소 리스트(임시 데이터)
  const [contentList, setContentList] = useState([]);
  //정렬 옵션(1:거리순, 2:리뷰많은순, 3:이름순)
  const [sortOption, setSortOption] = useState(1);
  //필터 옵션(null:전체, 1:숙박시설, 2:음식점, 3:그외)
  const [filterOption, setFilterOption] = useState(null);

  /*장소 리스트를 받아오는 함수(유저 마커 이동 시, 새로고침 시)
  useCallback() 사용으로 함수 저장(필요 이상 렌더링 방지)
  useMemo(): 값 저장   <=>   useCallback(): 함수 저장 */
  const getContentList = useCallback(() => {
    //사용자 마커 없을 시 취소
    if (!userMarker) return;

    //사용자 마커 좌표값 추출
    const [lat, lng] = [userMarker.lat, userMarker.lng];

    //contentTypeId에 네이밍 해주는 함수
    const getContentTypeName = (typeId) => {
      switch (typeId) {
        case 12:
          return "관광지";
        case 14:
          return "문화시설";
        case 15:
          return "축제/행사";
        case 28:
          return "레포츠";
        case 38:
          return "쇼핑";
        case 32:
          return "숙박시설";
        case 39:
          return "음식점";
      }
    };

    //서버 데이터 요청
    //유저 마커 좌표, 검색 반경 전달
    axios
      // .get(`${process.env.REACT_APP_BACK_SERVER}/plan/nearby?lat=${lat}&lng=${lng}&radius=${userRadius}`)
      .get(`${process.env.REACT_APP_BACK_SERVER}/plan/nearby`, {
        params: {
          lat,
          lng,
          radius: userRadius,
        },
      })
      .then((res) => {
        const mappedData = res.data.map((spot) => {
          return {
            contentId: spot.contentId,
            contentThumb:
              spot.contentThumb === null
                ? "./image/spot_default_img.png"
                : spot.contentThumb,
            contentTitle: spot.contentTitle,
            contentType: getContentTypeName(spot.contentTypeId),
            contentAddr: spot.contentAddr,
            contentReview: spot.contentReview,
            contentRating: spot.contentRating,
            contentLatLng: {
              lat: spot.mapLat,
              lng: spot.mapLng,
            },
            distance: spot.distance, //userMarker에서 spot까지의 거리
          };
        });
        setContentList(mappedData);
      })
      .catch((err) => {
        console.log(err);
      });
    //아래 배열 내 값이 바뀔 때 함수를 재생성함(useCallback)
  }, [userMarker, userRadius, sortOption]);

  //작성해 둔 getContentList()를 useEffect()로 관리
  useEffect(() => {
    if (!userMarker) return; //첫실행 방지

    //지도 광클 시 데이터 계속 받아오는 현상 수정
    const timer = setTimeout(() => {
      getContentList();
    }, 500);

    return () => clearTimeout(timer);
  }, [userMarker]);

  /* 임시 비활성화
  //정렬된 장소(의 값): useMemo()로 기억
  const sortedList = useMemo(() => {
    if (sortOption === 2) {
      return [...contentList].sort((a, b) => b.contentReview - a.contentReview);
    } else if (sortOption === 3) {
      return [...contentList].sort((a, b) =>
        a.contentTitle.localeCompare(b.contentTitle)
      );
    }
    return contentList; //기본값: 그대로 반환
    //장소 새로 받아오거나, 정렬 옵션 바뀌면 새 값 업데이트(콜백 실행)
  }, [contentList, sortOption]);

  //필터링 된 장소(의 값): useMemo()로 기억
  const filteredSortedList = useMemo(() => {
    if (filterOption === 1) {
      return sortedList.filter((item) => item.contentType === "숙박시설");
    } else if (filterOption === 2) {
      return sortedList.filter((item) => item.contentType === "음식점");
    } else if (filterOption === 3) {
      return sortedList.filter(
        (item) =>
          item.contentType !== "숙박시설" && item.contentType !== "음식점"
      );
    }
    setOpenOverlay(null);
    return sortedList; //기본값: sorted 상태 그대로 반환
    //정렬된 장소(의 값)가 변동되거나, 필터 옵션 바뀌면 새 값 업데이트(콜백 실행)
  }, [sortedList, filterOption]);
  */

  const filteredSortedList = useMemo(() => {
    let sortedList = [...contentList];
    if (sortOption === 2) {
      sortedList.sort((a, b) => b.contentReview - a.contentReview);
    } else if (sortOption === 3) {
      sortedList.sort((a, b) => a.contentTitle.localeCompare(b.contentTitle));
    }

    let filteredSortedList = sortedList;
    if (filterOption === 1) {
      filteredSortedList = sortedList.filter(
        (item) => item.contentType === "숙박시설"
      );
    } else if (filterOption === 2) {
      filteredSortedList = sortedList.filter(
        (item) => item.contentType === "음식점"
      );
    } else if (filterOption === 3) {
      filteredSortedList = sortedList.filter(
        (item) =>
          item.contentType !== "숙박시설" && item.contentType !== "음식점"
      );
    }

    return filteredSortedList;
  }, [contentList, sortOption, filterOption]);

  //sort, filter 옵션 변경 시 오버레이 닫히게 하기(버그 방지)
  useEffect(() => {
    setOpenOverlay(null);
  }, [sortOption, filterOption]);

  //filter 기능 제공 값
  const filterItems = [
    { name: "숙박시설", value: 1 },
    { name: "음식점", value: 2 },
    { name: "즐길거리", value: 3 },
  ];

  //메인 리턴부
  return (
    <div className="all-wrap">
      <div className="side-wrap">
        <div className="side-header">
          <div className="logo planner-logo">
            <Link to="/">NADRI</Link>
          </div>
          <div className="search-wrap">
            <CustomizedInputBase />
          </div>
          <div className="filter-wrap">
            {filterItems.map((item) => {
              return (
                <div
                  className={
                    filterOption === item.value ? "filter-pressed" : ""
                  }
                  onClick={() => {
                    if (filteredSortedList.length === 0) return;
                    setFilterOption(item.value);
                  }}
                >
                  {item.name}
                  {filterOption === item.value && (
                    <CancelOutlined
                      className="filter-reset-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterOption(null);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="sort-wrap">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(Number(e.target.value))}
              disabled={contentList.length === 0}
            >
              <option value={1}>거리순</option>
              <option value={2}>리뷰많은순</option>
              <option value={3}>이름순</option>
            </select>
          </div>
        </div>
        <div className="spot-list">
          <p>{filteredSortedList.length}개의 결과가 있습니다.</p>
          {filteredSortedList.map((content, idx) => {
            return (
              <PrintSpotList
                key={"spot-" + idx}
                content={content}
                idx={idx}
                openPlanningModal={openPlanningModal}
                setOpenPlanningModal={setOpenPlanningModal}
                plannedSpotList={plannedSpotList}
                setPlannedSpotList={setPlannedSpotList}
                setOpenPlanner={setOpenPlanner}
              />
            );
          })}
        </div>
      </div>
      {openPlanner ? (
        <Planner
          setOpenPlanner={setOpenPlanner}
          plannedSpotList={plannedSpotList}
          setPlannedSpotList={setPlannedSpotList}
        />
      ) : (
        <div
          className="planner-close-btn"
          onClick={() => {
            setOpenPlanner(true);
          }}
        >
          <span>📆</span>
          <p>계획표</p>
        </div>
      )}
      <div className="radius-slider">
        <label htmlFor="radiusRange">검색반경: {userRadius}m</label>
        <input
          id="radiusRange"
          type="range"
          min="100"
          max="5000"
          step="100"
          value={userRadius}
          onChange={(e) => {
            setUserRadius(parseInt(e.target.value));
          }}
        />
        <button className="re-search" onClick={getContentList}>
          새로고침
        </button>
      </div>
      <div className="map-wrap">
        <PrintMap
          filteredSortedList={filteredSortedList}
          openOverlay={openOverlay}
          setOpenOverlay={setOpenOverlay}
          openPlanningModal={openPlanningModal}
          setOpenPlanningModal={setOpenPlanningModal}
          mapBounds={mapBounds}
          setMapBounds={setMapBounds}
          userMarker={userMarker}
          setUserMarker={setUserMarker}
          userRadius={userRadius}
          setUserRadius={setUserRadius}
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
      <IconButton sx={{ p: "10px" }} aria-label=""></IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: "12px" }}
        placeholder="여행지, 즐길거리 등"
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label=""
        onClick={() => {
          console.log("hi");
        }}
      >
        <Search />
      </IconButton>
    </Paper>
  );
};

// 장소 리스트 출력하는 사이드 창
const PrintSpotList = (props) => {
  const content = props.content;
  const idx = props.idx;
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];
  const [plannedSpotList, setPlannedSpotList] = [
    props.plannedSpotList,
    props.setPlannedSpotList,
  ];
  const setOpenPlanner = props.setOpenPlanner;

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
        <button onClick={() => setOpenPlanningModal(idx)}>추가</button>
      </div>
      {openPlanningModal === idx && (
        <PlanningModal
          openPlanningModal={openPlanningModal}
          setOpenPlanningModal={setOpenPlanningModal}
          content={content}
          plannedSpotList={plannedSpotList}
          setPlannedSpotList={setPlannedSpotList}
          setOpenPlanner={setOpenPlanner}
        />
      )}
    </div>
  );
};

// 여행 플래너 출력 창
const Planner = (props) => {
  const setOpenPlanner = props.setOpenPlanner;
  const [plannedSpotList, setPlannedSpotList] = [
    props.plannedSpotList,
    props.setPlannedSpotList,
  ];
  return (
    <div className="planner-wrap">
      <Close className="close-btn" onClick={() => setOpenPlanner(false)} />
      <div className="planner-content">
        {[...plannedSpotList]
          .sort((a, b) => a.order - b.order)
          .map((content, idx) => {
            const isDateChanged =
              idx === 0 ||
              content.itineraryDate !== plannedSpotList[idx - 1].itineraryDate;
            const showTransport = idx !== 0;

            return (
              <div key={"planned-" + idx}>
                {showTransport && (
                  <div className="planned-transport">
                    <span>↓</span>
                    <span>{content.transport}(으)로 이동</span>
                  </div>
                )}
                {isDateChanged && (
                  <div className="planned-date">
                    {dayjs(content.itineraryDate).format("YYYY년 M월 D일")}
                  </div>
                )}
                <div className="planned-item">
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
                  <div className="planner-del-btn">
                    <Delete
                      onClick={() => {
                        //1. 삭제하시겠습니까?
                        if (window.confirm("삭제하시겠습니까?")) {
                          //2. plannedSpot 삭제 및 order 재정렬
                          const newList = plannedSpotList.filter(
                            (item) => item.order !== idx
                          );
                          if (idx === 0) {
                            //맨 처음 방문지를 삭제했다면
                            newList[0].transport = "";
                          }
                          newList.forEach((item, i) => {
                            item.order = i;
                          });
                          setPlannedSpotList(newList);
                        }
                        //3. DB 삭제, DB order 수정
                      }}
                    />
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
  const [plannedSpotList, setPlannedSpotList] = [
    props.plannedSpotList,
    props.setPlannedSpotList,
  ];

  const now = dayjs();
  const [date, setDate] = useState(now);
  // console.log(date.format("YYYY-MM-DD"));
  const [transport, setTransport] = useState("");
  const [order, setOrder] = useState(plannedSpotList.length);

  const setOpenPlanner = props.setOpenPlanner;
  return (
    <div className="modal-background">
      <div className="planning-modal">
        <div className="page-title">여행지에 추가하기</div>
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
        <div className="planning-input">
          <div className="date-input">
            <span>계획일</span>
            <BasicDatePicker
              date={
                plannedSpotList.length === 0
                  ? date
                  : dayjs(
                      plannedSpotList[plannedSpotList.length - 1].itineraryDate
                    )
              }
              setDate={setDate}
            />
          </div>
          {order !== 0 && (
            <div>
              <span>어떻게 가실 건가요?</span>
              <BasicSelect transport={transport} setTransport={setTransport} />
            </div>
          )}
          <div className="spot-btn">
            <button
              style={{ width: "100px", height: "30px" }}
              onClick={() => {
                if (date.format("YYYY-MM-DD") < dayjs().format("YYYY-MM-DD")) {
                  window.alert("오늘보다 이른 날짜를 고를 수 없습니다.");
                  return;
                }
                if (
                  order > 0 &&
                  date.format("YYYY-MM-DD") <
                    plannedSpotList[order - 1].itineraryDate
                ) {
                  window.alert("이전 일정보다 이른 날짜를 고를 수 없습니다.");
                  return;
                }
                if (order !== 0 && transport === "") {
                  window.alert("이동 수단을 선택하세요.");
                  return;
                }

                const spotWithPlan = {
                  ...content,
                  itineraryDate: date.format("YYYY-MM-DD"),
                  transport: transport,
                  order,
                };

                //함수형 업데이트(동기형 업데이트)
                //직전 상태 값을 기준으로 그 값에 계속해서 추가해 줌
                setPlannedSpotList((prev) => [...prev, spotWithPlan]);
                setOpenPlanningModal(null);
                setOpenPlanner(true);
              }}
            >
              여행지에 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//카카오맵
const PrintMap = (props) => {
  const filteredSortedList = props.filteredSortedList;
  const [openOverlay, setOpenOverlay] = [
    props.openOverlay,
    props.setOpenOverlay,
  ];
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];
  const [mapBounds, setMapBounds] = [props.mapBounds, props.setMapBounds];
  const [userMarker, setUserMarker] = [props.userMarker, props.setUserMarker];
  const [userRadius, setUserRadius] = [props.userRadius, props.setUserRadius];

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
      //지도 클릭 시
      onClick={(map, e) => {
        if (openOverlay === null) {
          //클릭 위치 좌표
          const lat = e.latLng.getLat();
          const lng = e.latLng.getLng();
          console.log(lat + " " + lng);
          setUserMarker({ lat, lng });
        } else {
          setOpenOverlay(null);
        }
      }}
      //지도 로드 완료 시
      onCreate={(map) => {
        //지도 중심 좌표
        // console.log(map.getCenter());
      }}
      //현재 보이는 화면 범위를 가져옴
      onBoundsChanged={(map) => {
        setMapBounds(map.getBounds());
      }}
    >
      {userMarker && (
        <>
          <MapMarker
            position={userMarker}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 예시용 커스텀 마커
              size: { width: 24, height: 35 },
            }}
          />
          <Circle
            center={userMarker}
            radius={userRadius}
            strokeWeight={2}
            strokeColor={"var(--main2)"}
            strokeStyle={"solid"}
            fillColor={"#0055ff"}
            fillOpacity={0.15}
          />
        </>
      )}
      {filteredSortedList.map((spot, idx) => {
        return (
          <div key={"marker-" + idx}>
            <MapMarker
              position={spot.contentLatLng}
              onClick={() => setOpenOverlay(idx)}
            />

            {openOverlay === idx && (
              <CustomOverlayMap clickable={true} position={spot.contentLatLng}>
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
                            <button
                              onClick={() => {
                                setOpenPlanningModal(idx);
                              }}
                            >
                              추가
                            </button>
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
