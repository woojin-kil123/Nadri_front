import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./mypageListCard.css"; // CSS는 따로 작성
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "./RecoilData";
import axios from "axios";

export default function MypageListCard(props) {
  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const navigate = useNavigate();
  const place = props.place;
  const [bookmarked, setBookmarked] = useState(place.bookmarked);
  const [liked, setLiked] = useState(false);
  const handleClick = () => {
    setLiked((prev) => !prev);
  };

  // 좋아요 토글 핸들러
  const handleToggleLike = (placeId) => {
    axios
      .post(
        `${process.env.REACT_APP_BACK_SERVER}/place/bookmark/toggle`,
        null,
        {
          params: {
            memberNickname: memberNickname,
            placeId: placeId,
          },
        }
      )
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

  console.log(bookmarked);

  return (
    <>
      {!place ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card2"
          onClick={() => {
            navigate(`/place/detail/${place.placeId}`);
          }}
        >
          <div className="image-container">
            <img
              src={place.placeThumb ? place.placeThumb : "/image/dora.png"}
              className="card-image"
              alt={place.placeTitle}
            />
            <div className="heart-icon" style={{ cursor: "pointer" }}>
              {bookmarked === 1 ? (
                <FavoriteIcon onClick={handleHeartClick} />
              ) : (
                <FavoriteBorderIcon onClick={handleHeartClick} />
              )}
            </div>
          </div>
          <div className="card2-content">
            <p className="location">
              {place.areaName} &nbsp;
              {place.sigunguName}
            </p>
            <h3 className="title">{place.placeTitle}</h3>
            <div className="rating">
              <span className="stars">
                <StarRating rating={place.rating} />
              </span>
              <span className="score">
                {place.rating}
                {place.ratingCount && `(${place.ratingCount})`}
              </span>
            </div>
            <p className="category">{place.cat3Name}</p>
          </div>
        </div>
      )}
    </>
  );
}
