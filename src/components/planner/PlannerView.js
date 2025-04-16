import { Close, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { Link, useParams } from "react-router-dom";
import ToggleBookmark from "./utils/ToggleBookmark";
import DeletePlannerButton from "./utils/DeletePlannerButton";

const PlannerView = (props) => {
  const {
    openPlanner,
    setOpenPlanner,
    plannedPlaceList,
    setPlannedPlaceList,
    planName,
    setPlanName,
    plannerMode,
    setPlannerMode,
    setOpenOverlay,
    setMapCenter,
    isOwner,
    bookmarked,
  } = props;

  const handleDeletePlace = (odr) => {
    const newList = plannedPlaceList.filter((item) => item.order !== odr);
    if (odr === 0 && newList.length > 0) {
      newList[0].transport = "";
    }
    newList.forEach((item, i) => {
      item.order = i;
    });
    setPlannedPlaceList(newList);
  };

  return (
    <>
      {openPlanner ? (
        <Planner
          setOpenPlanner={setOpenPlanner}
          plannedPlaceList={plannedPlaceList}
          handleDeletePlace={handleDeletePlace}
          planName={planName}
          setPlanName={setPlanName}
          plannerMode={plannerMode}
          setOpenOverlay={setOpenOverlay}
          setMapCenter={setMapCenter}
          bookmarked={bookmarked}
          isOwner={isOwner}
        />
      ) : (
        <div
          className={`planner-close-btn ${
            plannerMode === "view" ? "full" : ""
          }`}
          onClick={() => setOpenPlanner(true)}
        >
          <span>📆</span>
          <p>플래너</p>
        </div>
      )}
      <div className="planner-handler-wrap">
        {plannerMode === "view" ? (
          isOwner ? (
            <div className="save-plan-btn">
              <button onClick={() => setPlannerMode("write")}>수정</button>
            </div>
          ) : (
            <>
              <div className="save-plan-btn">
                <button onClick={() => {}}>이 플래너로 시작</button>
              </div>
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

// 여행 플래너 출력 창
const Planner = (props) => {
  const setOpenPlanner = props.setOpenPlanner;
  const plannedPlaceList = props.plannedPlaceList;
  const handleDeletePlace = props.handleDeletePlace;
  const [planName, setPlanName] = [props.planName, props.setPlanName];
  const plannerMode = props.plannerMode;
  const setOpenOverlay = props.setOpenOverlay;
  const setMapCenter = props.setMapCenter;
  const bookmarked = props.bookmarked;
  const isOwner = props.isOwner;

  const { planNo } = useParams();

  return (
    <div className={`planner-wrap ${plannerMode === "view" ? "full" : ""}`}>
      {plannerMode === "view" && (
        <>
          <div className="logo planner-logo">
            <Link to="/">NADRI</Link>
          </div>
          {!isOwner ? (
            <ToggleBookmark
              bookmarked={bookmarked}
              objectNo={planNo}
              controllerUrl={"/plan"}
            />
          ) : (
            <DeletePlannerButton objectNo={planNo} />
          )}
        </>
      )}
      {plannerMode === "write" && (
        <Close className="close-btn" onClick={() => setOpenPlanner(false)} />
      )}
      {plannedPlaceList.length === 0 && (
        <div className="empty-plan">플래너가 비어 있습니다...</div>
      )}
      <div className="plan-name">
        {plannerMode === "view" && (
          <div className="plan-name-shadow">플랜명</div>
        )}
        <input
          type="text"
          placeholder="플래너 이름을 작성하세요"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          readOnly={plannerMode === "view"}
        />
      </div>
      {plannedPlaceList
        .sort((a, b) => a.order - b.order)
        .map((p, idx) => {
          const isDateChanged =
            idx === 0 ||
            p.itineraryDate !== plannedPlaceList[idx - 1].itineraryDate;
          const showTransport = idx !== 0;
          if (p.placeThumb == null) {
            p.placeThumb = "/image/place_default_img.png";
          }
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
                  ㅡ {dayjs(p.itineraryDate).format("YYYY년 M월 D일")} ㅡ
                </div>
              )}
              <div
                className="planned-item"
                onClick={() => {
                  setOpenOverlay(p.placeId);
                  setMapCenter(p.placeLatLng);
                }}
              >
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
                {plannerMode === "write" && (
                  <div className="planner-del-btn">
                    <Delete onClick={() => handleDeletePlace(p.order)} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PlannerView;
