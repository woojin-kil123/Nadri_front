import { useEffect, useState } from "react";
import "./place.css";
import axios from "axios";
import StarRating from "../utils/StarRating";
import { Link, useNavigate, useParams } from "react-router-dom";

const PlaceDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [review, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);
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
  }, [reqPage]);
  return (
    <div className="container">
      <div className="header">
        <p className="rating">
          ★ 5.0 (22) <span className="location">서울시, 중구</span>
        </p>
        <h1 className="title">남산순환나들길</h1>
      </div>

      <div className="content">
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
          <div className="info-item">
            <strong>영업시간</strong>
            <p>상시 개방</p>
          </div>
          <div className="info-item">
            <strong>쉬는날</strong>
            <p>연중무휴</p>
          </div>
          <div className="info-item">
            <strong>주차시설</strong>
            <p>가능</p>
          </div>
        </div>
      </div>
      <div className="place-detail page-title">
        <h2>리뷰</h2>
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
