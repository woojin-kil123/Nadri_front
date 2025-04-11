import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import "./mypageListCard.css"; // CSS는 따로 작성
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MypageListCard(props) {
  const navigate = useNavigate();
  const place = props.place;
  const [liked, setLiked] = useState(false);
  const handleClick = () => {
    setLiked((prev) => !prev);
  };
  return (
    <>
      {!place ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card2"
          onClick={() => {
            // place.route && navigate("/place/detail:" + place.placeId);
            navigate(`/place/detail/${place.placeId}`);
          }}
        >
          <div className="image-container">
            <img
              src={place.placeThumb ? place.placeThumb : "/image/dora.png"}
              className="card-image"
            />
            <div
              className="heart-icon"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <div onClick={handleClick} style={{ cursor: "pointer" }}>
                {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </div>
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
