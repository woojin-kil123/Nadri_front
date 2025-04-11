import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ListCard.css";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginState } from "./RecoilData";
import Swal from "sweetalert2";

export default function ListCard(props) {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);

  const place = props.place;
  const memberNickname = props.memberNickname;
  const liked = props.liked; // 부모에서 상태 받음
  const onToggleLike = props.onToggleLike;

  const handleHeartClick = (e) => {
    e.stopPropagation();

    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "로그인 후 좋아하는 장소로 나드리가요!",
        confirmButtonText: "확인",
      }).then(() => navigate("/login")); // ✅ 이 안에서 navigate 실행
    } else {
      onToggleLike(place.placeId); // ✅ 한 번만 호출
    }
  };

  return (
    <>
      {!place ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card"
          onClick={() => navigate(`/place/detail/${place.placeId}`)}
        >
          <div className="image-container">
            <img
              src={place.placeThumb || "/image/dora.png"}
              className="card-image"
              alt={place.placeTitle}
            />
            <div className="heart-icon" style={{ cursor: "pointer" }}>
              {liked ? (
                <FavoriteIcon onClick={handleHeartClick} />
              ) : (
                <FavoriteBorderIcon onClick={handleHeartClick} />
              )}
            </div>
          </div>
          <div className="card-content">
            <p className="location">
              {place.areaName} &nbsp;{place.sigunguName}
            </p>
            <h3 className="title">{place.placeTitle}</h3>
            <div className="rating">
              <span className="stars">
                <StarRating rating={place.placeRating} />
              </span>
              <span className="score">
                {place.placeRating}
                {place.placeReview && ` (${place.placeReview})`}
              </span>
            </div>
            <p className="category">{place.cat3Name}</p>
          </div>
        </div>
      )}
    </>
  );
}
