import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextEditor from "../utils/Texteditor";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";

const EditReview = () => {
  const reviewNo = useParams().reviewNo;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/${reviewNo}`)
      .then((res) => {
        setTitle(res.data.reviewTitle);
        setContent(res.data.reviewTitle);
        setRating(res.data.starRate);
      })
      .catch((err) => console.log(err));
  }, []);
  const reviewEdit = () => {};
  return (
    <section className="section review-write-section">
      {/* 오른쪽 - 리뷰 작성 폼 */}
      <div className="review-form">
        <div className="form-section">
          <label className="form-label">귀하의 경험에 대해 평가해주세요</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div className="form-section">
          <label className="form-label">리뷰 쓰기</label>
          <TextEditor data={content} setData={setContent} />
        </div>

        <div className="form-section">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="경험했던 것 중 가장 중요한 정보를 알려주세요"
          />
        </div>

        <button className="submit-button" onClick={reviewEdit}>
          리뷰수정
        </button>
      </div>
    </section>
  );
};
const StarRating = ({ totalStars = 5, rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => (
        <span
          key={index}
          className={`star-icon ${index < rating ? "filled" : ""}`}
          onClick={() => setRating(index + 1)}
        >
          {index < rating ? <StarRateIcon /> : <StarOutlineIcon />}
        </span>
      ))}
    </div>
  );
};

export default EditReview;
