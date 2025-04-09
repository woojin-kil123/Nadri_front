import { Close } from "@mui/icons-material";
import { CustomOverlayMap, MapMarker } from "react-kakao-maps-sdk";
import StarRating from "../utils/StarRating";

const MarkerWithOverlay = (props) => {
  const p = props.place;
  const idx = props.idx;
  const [openOverlay, setOpenOverlay] = [
    props.openOverlay,
    props.setOpenOverlay,
  ];
  const setOpenPlanningModal = props.setOpenPlanningModal;
  const isPlanned = props.isPlanned;
  const handleDeletePlace = props.handleDeletePlace;

  return (
    <>
      <MapMarker
        position={p.placeLatLng}
        onClick={() => setOpenOverlay(p.placeId)}
        image={
          isPlanned
            ? {
                src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                size: { width: 24, height: 35 },
              }
            : undefined
        }
      />
      {isPlanned && (
        <CustomOverlayMap position={p.placeLatLng} yAnchor={1}>
          <div className="numbered-marker">
            <div className="marker-circle">{p.order + 1}</div>
          </div>
        </CustomOverlayMap>
      )}
      {openOverlay === p.placeId && (
        <CustomOverlayMap clickable={true} position={p.placeLatLng} zIndex={2}>
          <div className="overlay-wrap">
            <div className="overlay-info">
              <div className="overlay-title">
                <div className="overlay-title-name">
                  {p.placeTitle}
                  <span className="overlay-class">{p.placeType}</span>
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
                    src={p.placeThumb}
                    width="85"
                    height="80"
                    alt={p.placeTitle}
                  />
                </div>
                <div className="overlay-desc">
                  <div className="overlay-addr">{p.placeAddr}</div>
                  <div className="overlay-rating">
                    <StarRating rating={p.placeRating} />
                    <span>
                      ( {p.placeReview > 999 ? "999+" : p.placeReview} )
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
                    <div className="place-btn">
                      {isPlanned ? (
                        <button
                          onClick={() => {
                            setOpenOverlay(null);
                            handleDeletePlace(p.order);
                          }}
                        >
                          삭제
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // setOpenOverlay(null);
                            setOpenPlanningModal(p.placeId);
                          }}
                        >
                          추가
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CustomOverlayMap>
      )}
    </>
  );
};

export default MarkerWithOverlay;
