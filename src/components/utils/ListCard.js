import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ListCard.css"; // CSS는 따로 작성
import StarRating from "./StarRating";
import { useNavigate } from "react-router-dom";

export default function ListCard(props) {
  const navigate = useNavigate();
  const content = props.content;
  console.log(content);
  return (
    <>
      {!content ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card"
          onClick={() => {
            content.route && navigate(content.route);
          }}
        >
          <div className="image-container">
            <img
              src={
                content.contentThumb ? content.contentThumb : "/image/dora.png"
              }
              className="card-image"
            />
            <div className="heart-icon">
              <FavoriteIcon
                style={{ color: "#4CAF50" }}
                onClick={content.favorFunc}
              />
            </div>
          </div>
          <div className="card-content">
            <p className="location">
              {content.areaName} &nbsp;
              {content.sigunguName}
            </p>
            <h3 className="title">{content.contentTitle}</h3>
            <div className="rating">
              <span className="stars">
                <StarRating rating={content.rating} />
              </span>
              <span className="score">
                {content.rating}
                {content.ratingCount && `(${content.ratingCount})`}
              </span>
            </div>
            <p className="category">{content.category}</p>
          </div>
        </div>
      )}
    </>
  );
}
