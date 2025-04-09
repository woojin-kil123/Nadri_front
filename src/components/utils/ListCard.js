import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ListCard.css"; // CSS는 따로 작성
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

export default function ListCard(props) {
  const navigate = useNavigate();
  const place = props.place;
  return (
    <>
      {!place ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card"
          onClick={() => {
            // place.route && navigate("/place/:" + place.placeId);
            navigate(`/place/detail/${place.placeId}`);
          }}
        >
          <div className="image-container">
            <img
              src={place.placeThumb ? place.placeThumb : "/image/dora.png"}
              className="card-image"
            />
            <div className="heart-icon">
              <FavoriteIcon
                style={{ color: "#4CAF50" }}
                onClick={place.favorFunc}
              />
            </div>
          </div>
          <div className="card-content">
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
