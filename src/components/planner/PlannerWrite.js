import {
  CancelOutlined,
  Close,
  Favorite,
  FavoriteBorder,
  Save,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import StarRating from "../utils/StarRating";
import BasicDatePicker from "../utils/BasicDatePicker";
import dayjs from "dayjs";
import BasicSelect from "../utils/BasicSelect";
import PageNavigation from "../utils/PageNavigtion";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import GetBoundsByLevel from "../utils/GetBoundsByLevel";
import CaptureMap from "./utils/CaptureMap";
import PlannerGuideModal from "./utils/PlannerGuideModal";
import CustomizedInputBase from "./utils/CustomizedInputBase";
const leafletImage = require("leaflet-image");

const PlannerWrite = (props) => {
  const {
    userMarker,
    openPlanningModal,
    setOpenPlanningModal,
    plannedPlaceList,
    setPlannedPlaceList,
    planName,
    setPlanName,
    placeList,
    setPlaceList,
    setOpenOverlay,
    setOpenPlanner,
    setMapCenter,
    mapLevel,
    setMapLevel,
  } = props;

  const memberNickname = useRecoilValue(loginNicknameState);
  //플래너 저장 창 여닫음
  const [openSaveModal, setOpenSaveModal] = useState(false);

  //필터 옵션(null:전체, 1:숙박시설, 2:음식점, 3:그외)
  const [filterOption, setFilterOption] = useState(null);
  //정렬 옵션(1:거리순, 2:리뷰많은순, 3:이름순)
  const [sortOption, setSortOption] = useState(2);

  //페이지네이션 관련
  const [totalCount, setTotalCount] = useState(0);
  const [reqPage, setReqPage] = useState(1);
  const [pageInfo, setPageInfo] = useState("");

  //getPlaceList() 실행 관리
  useEffect(() => {
    if (!userMarker) return;

    //장소 조회 타이머 설정: 0.5초 뒤 실행
    const timer = setTimeout(() => {
      getPlaceList();
    }, 500);

    //0.5초 내 새 조회 요청이 발생하면 타이머 리셋(랙 방지)
    return () => clearTimeout(timer);
  }, [userMarker, sortOption, filterOption, reqPage]);

  //서버에서 장소 받아오는 함수
  const getPlaceList = useCallback(() => {
    if (!userMarker) return;

    const [lat, lng] = [userMarker.lat, userMarker.lng];

    //placeTypeId 매핑 함수
    const getPlaceTypeName = (typeId) => {
      switch (typeId) {
        case 12:
          return "관광지";
        case 14:
          return "즐길거리";
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

    const { width, height } = GetBoundsByLevel(mapLevel);

    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/plan/${memberNickname}/nearby`,
        {
          params: {
            lat,
            lng,
            width,
            height,
            page: reqPage,
            size: 60, //한 페이지 당 장소 수
            sortOption: sortOption,
            filterOption: filterOption,
          },
        }
      )
      .then((res) => {
        const { list, totalCount, pageInfo } = res.data;
        const mappedData = list.map((p, idx) => {
          return {
            placeId: p.placeId,
            placeThumb: p.placeThumb ?? "/image/place_default_img.png",
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
            placeBookmarked: p.bookmarked,
            _originalIndex: idx,
          };
        });
        setPlaceList(
          //북마크 된 장소를 우선적으로 맨앞으로 정렬
          //이후 orderBy 기준을 기억해둔 idx를 이용해 2차 정렬
          mappedData.sort((a, b) => {
            if (b.placeBookmarked !== a.placeBookmarked)
              return b.placeBookmarked - a.placeBookmarked;
            return a._originalIndex - b._originalIndex;
          })
        );
        setTotalCount(totalCount);
        setPageInfo(pageInfo);
      })
      .catch((err) => {});
    //아래 배열 내 값이 바뀔 때 함수를 재생성함(useCallback)
  }, [userMarker, sortOption, filterOption, reqPage]);

  //sort, filter 변경 시 오버레이 닫기(버그 방지)
  useEffect(() => {
    setOpenOverlay(null);
  }, [sortOption, filterOption]);

  useEffect(() => {
    setReqPage(1); // 정렬/필터 변경 시 첫 페이지
  }, [sortOption, filterOption, userMarker]);

  //filter 기능 제공 값
  const filterItems = [
    { name: "숙박시설", value: 32 },
    { name: "음식점", value: 39 },
    { name: "관광지", value: 12 },
    { name: "즐길거리", value: 0 },
  ];

  //메인 리턴부
  return (
    <>
      <div className="side-wrap">
        <div className="side-header">
          <div className="logo planner-logo">
            <Link to="/">NADRI</Link>
          </div>
          <div className="search-wrap">
            <CustomizedInputBase
              setMapCenter={setMapCenter}
              setMapLevel={setMapLevel}
            />
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
              // disabled={placeList.length === 0}
            >
              <option value={2}>리뷰많은순</option>
              <option value={1}>거리순</option>
              <option value={3}>이름순</option>
            </select>
          </div>
        </div>
        <div className="place-list">
          <p>{totalCount}개의 결과가 있습니다.</p>
          {placeList.length > 0 && (
            <PageNavigation
              pi={pageInfo}
              reqPage={reqPage}
              setReqPage={setReqPage}
            />
          )}
          {placeList.map((p, idx) => {
            return (
              <PrintPlaceList
                key={"place-" + idx}
                place={p}
                openPlanningModal={openPlanningModal}
                setOpenPlanningModal={setOpenPlanningModal}
                plannedPlaceList={plannedPlaceList}
                setPlannedPlaceList={setPlannedPlaceList}
                setOpenPlanner={setOpenPlanner}
                setOpenOverlay={setOpenOverlay}
                setMapCenter={setMapCenter}
              />
            );
          })}
          {placeList.length > 0 && (
            <PageNavigation
              pi={pageInfo}
              reqPage={reqPage}
              setReqPage={setReqPage}
            />
          )}
        </div>
      </div>
      <div className="planner-handler-wrap">
        {plannedPlaceList.length !== 0 && (
          <div className="save-plan-btn">
            <Button
              onClick={() => {
                setOpenSaveModal(true);
              }}
              variant="contained"
              startIcon={<Save />}
              sx={{ backgroundColor: "var(--main2)" }}
            >
              저장
            </Button>
          </div>
        )}
      </div>
      <PlannerGuideModal />
      {openSaveModal && (
        <SavePlanModal
          planName={planName}
          setPlanName={setPlanName}
          setOpenSaveModal={setOpenSaveModal}
          plannedPlaceList={plannedPlaceList}
        />
      )}
    </>
  );
};

// 장소 리스트 출력하는 사이드 창
const PrintPlaceList = (props) => {
  const p = props.place;
  const [openPlanningModal, setOpenPlanningModal] = [
    props.openPlanningModal,
    props.setOpenPlanningModal,
  ];
  const [plannedPlaceList, setPlannedPlaceList] = [
    props.plannedPlaceList,
    props.setPlannedPlaceList,
  ];
  const setOpenPlanner = props.setOpenPlanner;
  const setOpenOverlay = props.setOpenOverlay;
  const setMapCenter = props.setMapCenter;

  return (
    <div className="place-item">
      <div className="heart-icon">
        {p.placeBookmarked === 1 ? <Favorite /> : <FavoriteBorder />}
      </div>
      <img className="place-img" src={p.placeThumb} alt="테스트" />
      <div className="place-title-wrap">
        <span className="place-titlename">{p.placeTitle}</span>
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
        <button
          onClick={() => {
            setOpenOverlay(p.placeId);
            setMapCenter(p.placeLatLng);
          }}
        >
          보기
        </button>
      </div>
      {openPlanningModal === p.placeId && (
        <PlanningModal
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

// "여행지에 추가하기" 모달 창
const PlanningModal = (props) => {
  const setOpenPlanningModal = props.setOpenPlanningModal;
  const p = props.place;
  const [plannedPlaceList, setPlannedPlaceList] = [
    props.plannedPlaceList,
    props.setPlannedPlaceList,
  ];
  const setOpenPlanner = props.setOpenPlanner;
  const [date, setDate] = useState(dayjs());
  const [transport, setTransport] = useState("");
  const [order, setOrder] = useState(plannedPlaceList.length);

  useEffect(() => {
    if (plannedPlaceList.length > 0) {
      setDate(
        dayjs(plannedPlaceList[plannedPlaceList.length - 1].itineraryDate)
      );
      setTransport(
        plannedPlaceList[plannedPlaceList.length - 1].transport || ""
      );
    }
  }, [plannedPlaceList]);

  const handleAddPlace = () => {
    if (date.format("YYYY-MM-DD") < dayjs().format("YYYY-MM-DD")) {
      window.alert("오늘보다 이른 날짜를 고를 수 없습니다.");
      return;
    }
    if (
      order > 0 &&
      date.format("YYYY-MM-DD") < plannedPlaceList[order - 1].itineraryDate
    ) {
      window.alert("이전 일정보다 이른 날짜를 고를 수 없습니다.");
      return;
    }
    if (order !== 0 && transport === "") {
      window.alert("이동 수단을 선택하세요.");
      return;
    }

    const placeWithPlan = {
      placeAddr: p.placeAddr,
      placeId: p.placeId,
      placeLatLng: p.placeLatLng,
      placeRating: p.placeRating,
      placeReview: p.placeReview,
      placeThumb: p.placeThumb,
      placeTitle: p.placeTitle,
      placeType: p.placeType,
      itineraryDate: date.format("YYYY-MM-DD"),
      transport: transport,
      order,
    };

    setPlannedPlaceList([...plannedPlaceList, placeWithPlan]);
    setOpenPlanningModal(null);
    setOpenPlanner(true);
  };

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
              <div className="place-titlename">{p.placeTitle}</div>
              <div className="place-type">{p.placeType}</div>
            </div>
            <div className="place-addr">{p.placeAddr}</div>
          </div>
        </div>
        <div className="planning-input">
          <div className="date-input">
            <span>계획일</span>
            <BasicDatePicker date={date} setDate={setDate} />
          </div>
          {order !== 0 && (
            <div>
              <span>어떻게 가실 건가요?</span>
              <BasicSelect
                type={"이동수단"}
                list={["대중교통", "자가용", "자전거", "도보"]}
                data={transport}
                setData={setTransport}
              />
            </div>
          )}
          <div className="place-btn">
            <button
              style={{ width: "100px", height: "30px" }}
              onClick={handleAddPlace}
            >
              여행지에 추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//플래너 저장 모달
const SavePlanModal = (props) => {
  const memberNickname = useRecoilValue(loginNicknameState);
  const [planStatus, setPlanStatus] = useState("공개");
  const [planName, setPlanName] = [props.planName, props.setPlanName];
  const setOpenSaveModal = props.setOpenSaveModal;
  const plannedPlaceList = props.plannedPlaceList;
  const navigate = useNavigate();
  const { planNo } = useParams();
  const [mapInstance, setMapInstance] = useState(null);
  const [saving, setSaving] = useState(false);

  const planData = useMemo(
    () => ({
      tripPlanData: {
        planName: planName.trim() === "" ? "untitled" : planName,
        startDate: plannedPlaceList[0].itineraryDate,
        endDate: plannedPlaceList[plannedPlaceList.length - 1].itineraryDate,
        planThumb: "",
        planStatus: planStatus === "공개" ? 1 : 2, //2: 비공개
        memberNickname: memberNickname,
      },
      itineraryList: plannedPlaceList.map((item) => {
        return {
          itineraryDate: item.itineraryDate,
          startLocation:
            item.order === 0 ? null : plannedPlaceList[item.order - 1].placeId,
          transport: item.transport,
          endLocation: item.placeId,
          itineraryOrder: item.order,
        };
      }),
    }),
    [plannedPlaceList, planName, planStatus]
  );

  const handleSavePlanner = () => {
    if (saving) {
      alert("저장 중입니다. 잠시만 기다려주세요.");
      return;
    }
    if (planStatus === "") {
      window.alert("공개 여부를 선택하세요.");
      return;
    }
    if (!mapInstance) {
      alert("지도가 아직 준비되지 않았습니다. 잠시만 기다려주세요.");
      return;
    }

    setSaving(true);

    // leaflet 이미지 캡처
    leafletImage(mapInstance, function (err, canvas) {
      if (err || !canvas) {
        setSaving(false);
        return;
      }

      canvas.toBlob(
        (blob) => {
          const form = new FormData();
          form.append("file", blob, "plan_thumb.jpg");

          if (!planNo) {
            //새 플랜 저장
            axios
              .post(`${process.env.REACT_APP_BACK_SERVER}/plan/thumb`, form)
              .then((res) => {
                const savedFilename = res.data;
                planData.tripPlanData.planThumb = savedFilename;

                return axios.post(
                  `${process.env.REACT_APP_BACK_SERVER}/plan`,
                  planData
                );
              })
              .then((res) => {
                if (res.data) {
                  window.localStorage.removeItem(
                    `${memberNickname}_cache_planner`
                  );
                  setOpenSaveModal(false);
                  navigate("/mypage/planners");
                }
                setSaving(false);
              })
              .catch((err) => {
                console.log(err);
                setSaving(false);
              });
          } else {
            //기존 플랜 수정
            axios
              .post(
                `${process.env.REACT_APP_BACK_SERVER}/plan/${planNo}/thumb`,
                form
              )
              .then((res) => {
                const savedFilename = res.data;
                planData.tripPlanData.planThumb = savedFilename;

                return axios.put(
                  `${process.env.REACT_APP_BACK_SERVER}/plan/${planNo}`,
                  planData
                );
              })
              .then((res) => {
                if (res.data) {
                  setOpenSaveModal(false);
                  navigate("/mypage/planners");
                }
                setSaving(false);
              })
              .catch((err) => {
                console.log(err);
                setSaving(false);
              });
          }
        },
        "image/jpeg",
        0.95
      );
    });
  };

  return (
    <>
      {saving && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p>저장 중입니다. 잠시만 기다려주세요...</p>
        </div>
      )}
      <div className="modal-background">
        <div className="planning-modal save-modal">
          <div className="page-title">플래너 저장하기</div>
          <Close
            onClick={() => setOpenSaveModal(false)}
            className="close-btn"
          />
          <div className="save-readme">
            <div>저장하기에 앞서</div>
            <div>마지막으로 확인해주세요.</div>
          </div>
          <div className="planning-input">
            <div className="plan-name-box">
              <label style={{ color: "var(--main2)" }}>플래너 이름</label>
              <input
                style={{ fontSize: 14 }}
                type="text"
                placeholder="기본값은 untitled입니다"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
              />
            </div>
            <div>
              <span>이 플래너를</span>
              <BasicSelect
                type={"공개여부"}
                list={["공개", "비공개"]}
                data={planStatus}
                setData={setPlanStatus}
              />
              <span>합니다.</span>
            </div>
            <div className="place-btn">
              <button
                style={{ width: "100px", height: "30px" }}
                onClick={handleSavePlanner}
                disabled={saving || !mapInstance}
              >
                {saving ? "저장 중..." : "플래너 저장"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CaptureMap
        plannedPlaceList={plannedPlaceList}
        setMapInstance={setMapInstance}
      />
    </>
  );
};

export default PlannerWrite;
