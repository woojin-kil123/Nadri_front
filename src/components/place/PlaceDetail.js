import { useEffect, useState } from "react";
import "./place.css";
import axios from "axios";
import StarRating from "../utils/StarRating";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Place } from "@mui/icons-material";

const PlaceDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [review, setReview] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const placeId = useParams().placeId;
  const [place, setPlace] = useState();
  useEffect(() => {
    axios
      .get(`${backServer}/place/detail?placeId=${placeId}`)
      .then((res) => {
        console.log(res);
        setPlace(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`${backServer}/review/detail/${placeId}`)
      .then((res) => {
        console.log(res);
  const [pi, setPi] = useState([]);
  const placeId = useParams().placeId;
  const navigate = useNavigate();
  console.log(placeId);
  useEffect(() => {
    axios
      .get(`${backServer}/review/detail/${placeId}`)
      .then((res) => {
        console.log(res);
        setReview(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="place-detail-wrap">
      <div className="place-detail-header">
        <div className="detail-header-cat">
          {place && <div>{place.cat2Name}</div>}
          {place && <div>{place.cat3Name}</div>}
        </div>
        <div className="detail-header-title">
          {place && <h1 className="detail-title">{place.placeTitle}</h1>}
        </div>
        <div className="detail-header-info">
          {place && <a>{place.areaName},</a>}
          {place && <a> {place.sigunguName}</a>}
        </div>
      </div>
      <div className="place-detail-image">
        {place && (
          <img
            src={place.placeThumb ? place.placeThumb : "/image/dora.png"}
            className="detail-img1"
          ></img>
        )}
        <div className="detail-img2"></div>
        <div className="detail-img3"></div>
        <div className="detail-img4"></div>
      </div>
      <div className="place-detail-content">
        <div className="main-description">
          <p>
            도시 한복판에 우뚝 솟은 남산은 서울의 랜드마크이자 세계적 시민들의
            휴식처로 사랑받는다. 남산둘레길은 서울타워를 기점으로 남산을 한 바퀴
            돌아볼 수 있는 넓은 길로 설계되어 있다...
          </p>
        </div>

        <div className="info-box">
          <div className="info-item">
            <strong>주소</strong>
            <p>서울특별시 중구 남산공원길 609 (예장동)</p>
          </div>
          <div className="info-item">
            <strong>문의 및 안내</strong>
            <p>02-3783-5900</p>
          </div>
        </div>
      </div>
      <div className="place-detail page-title">
        <h2>리뷰</h2>
        <Link to="/review/write" className="btn-primary green">
          리뷰쓰기
        </Link>
        <div
          className="review-write btn-primary green"
          onClick={() => {
            navigate(`/review/write/${placeId}`);
          }}
        >
          글쓰기
        </div>
      </div>
      <div className="place-detail review-wap">
        <div>
          <ul className="posting-wrap">
            {review.map((review, index) => {
              return <ReviewItem key={"review-" + index} review={review} />;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ReviewItem = (props) => {
  const navigate = useNavigate();
  const review = props.review;
  return (
    <li
      className="posting-item"
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="posting-info">
        <div>
          <StarRating rating={review.starRate} />
        </div>
        <div className="posting-title">{review.reviewTitle}</div>
        <div>{review.reviewContent}</div>
        <div className="posting-sub-info">
          <span>{review.memberNickname}</span>
          <span>{review.reviewDate}</span>
        </div>
      </div>
    </li>
  );
};

export default PlaceDetail;
