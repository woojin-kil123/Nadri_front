import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Circle,
  CustomOverlayMap,
  Map,
  MapMarker,
  Polyline,
} from "react-kakao-maps-sdk";
import "./planner.css";
import { CancelOutlined, Close, Delete, Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import StarRating from "../utils/StarRating";
import BasicDatePicker from "../utils/BasicDatePicker";
import BasicSelect from "../utils/BasicSelect";
import dayjs from "dayjs";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import MarkerWithOverlay from "./MarkerWithOverlay";

const PlannerFrm = () => {
  //마커 오버레이 여닫음 state
  const [openOverlay, setOpenOverlay] = useState(null);
  //플래너 창 여닫음 state
  const [openPlanner, setOpenPlanner] = useState(false);
  //"플래너에 추가하기" 창 여닫음 state
  const [openPlanningModal, setOpenPlanningModal] = useState(null);
  //플래너에 추가한 장소 리스트 state
  const [plannedPlaceList, setPlannedPlaceList] = useState([]);
  //현재 보이는 지도 화면 state
  const [mapBounds, setMapBounds] = useState(null);
  //유저가 클릭한 지도 위치 state
  const [userMarker, setUserMarker] = useState(null);
  //유저 클릭 위치를 중심으로 하는 반경 범위
  const [userRadius, setUserRadius] = useState(1000);
  //장소 리스트(임시 데이터)
  const [placeList, setPlaceList] = useState([]);
  //정렬 옵션(1:거리순, 2:리뷰많은순, 3:이름순)
  const [sortOption, setSortOption] = useState(1);
  //필터 옵션(null:전체, 1:숙박시설, 2:음식점, 3:그외)
  const [filterOption, setFilterOption] = useState(null);

  //플래너 진입 시 "새 플래너" 진입인지, "기존 플래너" 진입인지 판단
  const { planNo } = useParams();
  useEffect(() => {
    if (planNo) {
      getPlanData(planNo);
    }
  }, [planNo]);

  //getPlaceList() 실행 관리
  useEffect(() => {
    if (!userMarker) return; //마커 없으면 실행 취소

    //마커 지정 시 타이머 설정: 0.5초 뒤 데이터 받아오게끔
    const timer = setTimeout(() => {
      getPlaceList();
    }, 500);

    //클린업 함수: useEffect 본문이 실행되기 전에 실행됨
    //0.5초 이내에 새 마커가 지정되면 현재 타이머 제거
    return () => clearTimeout(timer);
  }, [userMarker]);

  //sort, filter 변경 시 오버레이 닫기(버그 방지)
  useEffect(() => {
    setOpenOverlay(null);
  }, [sortOption, filterOption]);

  //기존에 작성 중인 플래너 받아오는 함수
  const getPlanData = useCallback(() => {
    const refreshToken = window.localStorage.getItem("refreshToken");
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/plan/verify/${planNo}`, {
        headers: {
          Authorization: refreshToken,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  //장소 리스트를 받아오는 함수
  //useCallback 사용으로 함수 기억(필요 이상의 렌더링 방지)
  const getPlaceList = useCallback(() => {
    //사용자 마커 없을 시 취소
    if (!userMarker) return;

    //사용자 마커 좌표값 추출
    const [lat, lng] = [userMarker.lat, userMarker.lng];

    //placeTypeId에 네이밍 해주는 함수
    const getPlaceTypeName = (typeId) => {
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

    //서버 데이터 요청; 전달값: 유저마커 좌표, 검색반경
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/plan/nearby`, {
        params: {
          lat,
          lng,
          radius: userRadius,
        },
      })
      .then((res) => {
        const mappedData = res.data.map((p) => {
          return {
            placeId: p.placeId,
            placeThumb:
              p.placeThumb === null
                ? "./image/place_default_img.png"
                : p.placeThumb,
            placeTitle: p.placeTitle,
            placeType: getPlaceTypeName(p.placeTypeId),
            placeAddr: p.placeAddr,
            placeReview: p.placeReview,
            placeRating: p.placeRating,
            placeLatLng: {
              lat: p.mapLat,
              lng: p.mapLng,
            },
            distance: p.distance, //userMarker에서 place까지의 거리
          };
        });
        setPlaceList(mappedData);
      })
      .catch((err) => {
        console.log(err);
      });
    //아래 배열 내 값이 바뀔 때 함수를 재생성함(useCallback)
  }, [userMarker, userRadius, sortOption]);

  //placeList가 정렬 및 필터링 된 결과값
  //useMemo 사용으로 "값" 기억
  const filteredSortedList = useMemo(() => {
    let sortedList = [...placeList];
    if (sortOption === 2) {
      sortedList.sort((a, b) => b.placeReview - a.placeReview);
    } else if (sortOption === 3) {
      sortedList.sort((a, b) => a.placeTitle.localeCompare(b.placeTitle));
    }

    let filteredSortedList = sortedList;
    if (filterOption === 1) {
      filteredSortedList = sortedList.filter(
        (item) => item.placeType === "숙박시설"
      );
    } else if (filterOption === 2) {
      filteredSortedList = sortedList.filter(
        (item) => item.placeType === "음식점"
      );
    } else if (filterOption === 3) {
      filteredSortedList = sortedList.filter(
        (item) => item.placeType === "관광지"
      );
    } else if (filterOption === 4) {
      filteredSortedList = sortedList.filter(
        (item) =>
          item.placeType !== "숙박시설" &&
          item.placeType !== "음식점" &&
          item.placeType !== "관광지"
      );
    }

    return filteredSortedList;
  }, [placeList, sortOption, filterOption]);

  const markableList = useMemo(() => {
    return filteredSortedList.filter(
      (item) => !plannedPlaceList.find((p) => p.placeId === item.placeId)
    );
  }, [filteredSortedList, plannedPlaceList]);

  //filter 기능 제공 값
  const filterItems = [
    { name: "숙박시설", value: 1 },
    { name: "음식점", value: 2 },
    { name: "관광지", value: 3 },
    { name: "즐길거리", value: 4 },
  ];

  const deletePlan = (odr) => {
    //1. 삭제하시겠습니까?
    if (window.confirm("삭제하시겠습니까?")) {
      //2. plannedPlace 삭제 및 order 재정렬
      const newList = plannedPlaceList.filter((item) => item.order !== odr);
      if (odr === 0) {
        //맨 처음 방문지를 삭제했다면
        newList[0].transport = "";
      }
      newList.forEach((item, i) => {
        item.order = i;
      });
      setPlannedPlaceList(newList);
    }
    //3. DB 삭제, DB order 수정
    //예정
  };

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
                    // if (filteredSortedList.length === 0) return;
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
              disabled={placeList.length === 0}
            >
              <option value={1}>거리순</option>
              <option value={2}>리뷰많은순</option>
              <option value={3}>이름순</option>
            </select>
          </div>
        </div>
        <div className="place-list">
          <p>{filteredSortedList.length}개의 결과가 있습니다.</p>
          {filteredSortedList.map((p, idx) => {
            return (
              <PrintPlaceList
                key={"place-" + idx}
                place={p}
                idx={idx}
                openPlanningModal={openPlanningModal}
                setOpenPlanningModal={setOpenPlanningModal}
                plannedPlaceList={plannedPlaceList}
                setPlannedPlaceList={setPlannedPlaceList}
                setOpenPlanner={setOpenPlanner}
                markableList={markableList}
              />
            );
          })}
        </div>
      </div>
      {openPlanner ? (
        <Planner
          setOpenPlanner={setOpenPlanner}
          plannedPlaceList={plannedPlaceList}
          setPlannedPlaceList={setPlannedPlaceList}
          deletePlan={deletePlan}
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
        <button className="re-search" onClick={getPlaceList}>
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
          plannedPlaceList={plannedPlaceList}
          deletePlan={deletePlan}
          markableList={markableList}
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
const PrintPlaceList = (props) => {
  const p = props.place;
  const idx = props.idx;
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];
  const [plannedPlaceList, setPlannedPlaceList] = [
    props.plannedPlaceList,
    props.setPlannedPlaceList,
  ];
  const setOpenPlanner = props.setOpenPlanner;
  const markableList = props.markableList;

  return (
    <div className="place-item">
      <img className="place-img" src={p.placeThumb} alt="테스트" />
      <div className="place-title-wrap">
        <span className="place-title">{p.placeTitle}</span>
        <span className="place-type">{p.placeType}</span>
      </div>
      <div className="place-addr place-ellipsis">{p.placeAddr}</div>
      <div className="place-review-wrap">
        <div>
          <StarRating rating={p.placeRating} />
          <span className="place-rating-avg">{p.placeRating}</span>
        </div>
        <div>
          <span>리뷰</span>
          <span className="place-review-count">
            {p.placeReview > 999 ? "999+" : p.placeReview}
          </span>
        </div>
      </div>
      <div className="place-btn">
        <button onClick={() => setOpenPlanningModal(p.placeId)}>추가</button>
      </div>
      {openPlanningModal === p.placeId && (
        <PlanningModal
          openPlanningModal={openPlanningModal}
          setOpenPlanningModal={setOpenPlanningModal}
          place={p}
          plannedPlaceList={plannedPlaceList}
          setPlannedPlaceList={setPlannedPlaceList}
          setOpenPlanner={setOpenPlanner}
        />
      )}
    </div>
  );
};

// 여행 플래너 출력 창
const Planner = (props) => {
  const setOpenPlanner = props.setOpenPlanner;
  const [plannedPlaceList, setPlannedPlaceList] = [
    props.plannedPlaceList,
    props.setPlannedPlaceList,
  ];
  const deletePlan = props.deletePlan;
  return (
    <div className="planner-wrap">
      <Close className="close-btn" onClick={() => setOpenPlanner(false)} />
      <div className="planner-place">
        {[...plannedPlaceList]
          .sort((a, b) => a.order - b.order)
          .map((p, idx) => {
            const isDateChanged =
              idx === 0 ||
              p.itineraryDate !== plannedPlaceList[idx - 1].itineraryDate;
            const showTransport = idx !== 0;

            return (
              <div key={"planned-" + idx}>
                {showTransport && (
                  <div className="planned-transport">
                    <span>↓</span>
                    <span>{p.transport}(으)로 이동</span>
                  </div>
                )}
                {isDateChanged && (
                  <div className="planned-date">
                    {dayjs(p.itineraryDate).format("YYYY년 M월 D일")}
                  </div>
                )}
                <div className="planned-item">
                  <img
                    className="planned-img"
                    src={p.placeThumb}
                    alt="테스트"
                    width="50px"
                    height="50px"
                  />
                  <div className="place-item">
                    <div className="place-title-wrap">
                      <span className="place-title">
                        {p.placeTitle}
                        {p.order}
                      </span>
                      <span className="place-type">{p.placeType}</span>
                    </div>
                    <div className="place-addr place-ellipsis">
                      {p.placeAddr}
                    </div>
                  </div>
                  <div className="planner-del-btn">
                    <Delete onClick={() => deletePlan(p.order)} />
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
  const p = props.place;
  const [plannedPlaceList, setPlannedPlaceList] = [
    props.plannedPlaceList,
    props.setPlannedPlaceList,
  ];

  const now = dayjs();
  const [date, setDate] = useState(now);
  // console.log(date.format("YYYY-MM-DD"));
  const [transport, setTransport] = useState("");
  const [order, setOrder] = useState(plannedPlaceList.length);

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
            src={p.placeThumb}
            alt="테스트"
            width="50px"
            height="50px"
          />
          <div className="place-item">
            <div className="place-title-wrap">
              <span className="place-title">{p.placeTitle}</span>
              <span className="place-type">{p.placeType}</span>
            </div>
            <div className="place-addr">{p.placeAddr}</div>
          </div>
        </div>
        <div className="planning-input">
          <div className="date-input">
            <span>계획일</span>
            <BasicDatePicker
              date={
                plannedPlaceList.length === 0
                  ? date
                  : dayjs(
                      plannedPlaceList[plannedPlaceList.length - 1]
                        .itineraryDate
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
          <div className="place-btn">
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
                    plannedPlaceList[order - 1].itineraryDate
                ) {
                  window.alert("이전 일정보다 이른 날짜를 고를 수 없습니다.");
                  return;
                }
                if (order !== 0 && transport === "") {
                  window.alert("이동 수단을 선택하세요.");
                  return;
                }

                const placeWithPlan = {
                  ...p,
                  itineraryDate: date.format("YYYY-MM-DD"),
                  transport: transport,
                  order,
                };

                //함수형 업데이트(동기형 업데이트)
                //직전 상태 값을 기준으로 그 값에 계속해서 추가해 줌
                setPlannedPlaceList((prev) => [...prev, placeWithPlan]);
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
  const plannedPlaceList = props.plannedPlaceList;
  const deletePlan = props.deletePlan;
  const markableList = props.markableList;

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
      {plannedPlaceList.length > 1 && (
        <Polyline //저장된 장소 간 직선 그리기
          path={plannedPlaceList
            .sort((a, b) => a.order - b.order)
            .map((p) => ({
              lat: p.placeLatLng.lat,
              lng: p.placeLatLng.lng,
            }))}
          strokeWeight={4}
          strokeColor={"tomato"}
          strokeOpacity={0.9}
          strokeStyle={"solid"}
        />
      )}
      {plannedPlaceList.length > 1 &&
        plannedPlaceList.slice(0, -1).map((p, idx) => {
          const next = plannedPlaceList[idx + 1];
          const midLat = (p.placeLatLng.lat + next.placeLatLng.lat) / 2;
          const midLng = (p.placeLatLng.lng + next.placeLatLng.lng) / 2;
          const rad = Math.atan2(
            next.placeLatLng.lat - p.placeLatLng.lat,
            next.placeLatLng.lng - p.placeLatLng.lng
          );
          const deg = (rad * 180) / Math.PI;

          return (
            <CustomOverlayMap
              key={"arrow-" + idx}
              position={{ lat: midLat, lng: midLng }}
            >
              <div
                className="arrow-marker"
                style={{ transform: `rotate(${-deg}deg)` }}
              >
                ➡
              </div>
            </CustomOverlayMap>
          );
        })}
      {userMarker && (
        <>
          <MapMarker
            position={userMarker}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
              size: { width: 24, height: 35 },
            }}
          />
          <Circle
            center={userMarker}
            radius={userRadius}
            strokeWeight={2}
            strokeColor={"var(--main2)"}
            strokeStyle={"solid"}
            fillColor={"var(--main4)"}
            fillOpacity={0.2}
          />
        </>
      )}
      {markableList.map((p, idx) => {
        return (
          <MarkerWithOverlay
            key={"marker-" + p.placeId}
            place={p}
            idx={idx}
            openOverlay={openOverlay}
            setOpenOverlay={setOpenOverlay}
            setOpenPlanningModal={setOpenPlanningModal}
          />
        );
      })}
      {plannedPlaceList.map((p, idx) => (
        <MarkerWithOverlay
          key={"planned-" + p.placeId}
          place={p}
          idx={markableList.length + idx}
          openOverlay={openOverlay}
          setOpenOverlay={setOpenOverlay}
          isPlanned={true}
          deletePlan={deletePlan}
        />
      ))}
    </Map>
  );
};

export default PlannerFrm;
