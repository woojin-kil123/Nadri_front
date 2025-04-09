import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { RecoilState, useRecoilValue } from "recoil";
import "./review.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
import StarRating from "../utils/StarRating";
const ReviewMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [review, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [content, setContnet] = useState(null);
  const [placeList, setPlaceList] = useState([]);

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_BACK_SERVER
        }/review?reqPage=${reqPage}&value=${"all"}`
      )
      .then((res) => {
        console.log(res);
        setReview(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);
  const changeContnent = (value) => {
    setContnet(value);
    setReqPage(1);
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/review?reqPage=${reqPage}&value=${value}`
      )
      .then((res) => {
        console.log(res);
        setReview(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="section">
      <div className="page-title">최신리뷰</div>
      <div className="review-nav-wrap">
        <nav className="review-nav">
          <ul>
            <li
              className={content === "room" ? "active" : ""}
              style={{ width: "15%" }}
              onClick={() => {
                changeContnent("stay");
              }}
            >
              숙소
            </li>
            <li
              className={content === "spot" ? "active" : ""}
              style={{ width: "15%" }}
              onClick={() => {
                changeContnent("spot");
              }}
            >
              관광지
            </li>
            <li
              className={content === "food" ? "active" : ""}
              style={{ width: "15%" }}
              onClick={() => {
                changeContnent("food");
              }}
            >
              음식점
            </li>
            <li
              className={content === "todo" ? "active" : ""}
              style={{ width: "15%" }}
              onClick={() => {
                changeContnent("todo");
              }}
            >
              즐길거리
            </li>
            <li
              className={content === "plan" ? "active" : ""}
              style={{ width: "15%" }}
              onClick={() => {
                changeContnent("plan");
              }}
            >
              플래너
            </li>
          </ul>
        </nav>
      </div>
      <div className="contnent-review-list">
        <div>
          <ul className="posting-wrap">
            {review.map((review, index) => {
              return <ReviewItem key={"review-" + index} review={review} />;
            })}
          </ul>
        </div>
        <div className="review-paging-wrap">
          <PageNavigation pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
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
export default ReviewMain;
