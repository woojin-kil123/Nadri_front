import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ListCard.css";
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "./RecoilData";
import Swal from "sweetalert2";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ListCard(props) {
  const place = props.place;
  // console.log(place.bookmarked);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const [bookmarked, setBookmarked] = useState(place.bookmarked);

  // 좋아요 토글 핸들러
  const handleToggleLike = (placeId) => {
    axios
      .post(`${backServer}/place/bookmark/toggle`, null, {
        params: {
          memberNickname: memberNickname,
          placeId: placeId,
        },
      })
      .then((res) => {
        setBookmarked(res.data);
      })
      .catch((err) => {
        console.error("좋아요 토글 실패:", err);
      });
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();

    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "로그인 후 좋아하는 장소로 나드리가요!",
        confirmButtonText: "확인",
      }).then(() => navigate("/login"));
    } else {
      handleToggleLike(place.placeId);
    }
  };

  // place.bookmarked 값이 바뀌면 state도 동기화
  useEffect(() => {
    setBookmarked(place.bookmarked);
  }, [place.bookmarked]);

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
              {bookmarked === 1 ? (
                <FavoriteIcon
                  onClick={handleHeartClick}
                  className="heart-icon"
                />
              ) : (
                <FavoriteBorderIcon
                  onClick={handleHeartClick}
                  className="heart-icon"
                />
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
