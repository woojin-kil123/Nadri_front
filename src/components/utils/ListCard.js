import FavoriteIcon from "@mui/icons-material/Favorite";
import "./ListCard.css"; // CSS는 따로 작성

export default function ListCard() {
  return (
    <div className="card">
      <div className="image-container">
        <img src="/image/dora.png" className="card-image" />
        <div className="heart-icon">
          <FavoriteIcon style={{ color: "#4CAF50" }} />
        </div>
      </div>
      <div className="card-content">
        <p className="location">서울시, 중구</p>
        <h3 className="title">남산순환나들길</h3>
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="score">5.0 (22)</span>
        </div>
        <p className="category">국립공원</p>
      </div>
    </div>
  );
}
