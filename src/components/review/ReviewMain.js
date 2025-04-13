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

  //전체 리뷰 데이터
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
  //타입에 따른 데이터
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
    <section className="section review-list-section">
      <div className="page-title">최신리뷰</div>
      <div className="review-nav-wrap">
        <nav className="review-nav">
          <ul>
            <li
              className={content === "12" ? "active" : ""}
              style={{ width: "20%", cursor: "pointer" }}
              onClick={() => {
                changeContnent("12");
              }}
            >
              관광지
            </li>
            <li
              className={content === "14" ? "active" : ""}
              style={{ width: "20%", cursor: "pointer" }}
              onClick={() => {
                changeContnent("14");
              }}
            >
              즐길거리
            </li>
            <li
              className={content === "32" ? "active" : ""}
              style={{ width: "20%", cursor: "pointer" }}
              onClick={() => {
                changeContnent("32");
              }}
            >
              숙박
            </li>
            <li
              className={content === "39" ? "active" : ""}
              style={{ width: "20%", cursor: "pointer" }}
              onClick={() => {
                changeContnent("39");
              }}
            >
              음식점
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
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="posting-thumb">
        <img
          src={review.placeThumb || "/image/default_img.png"}
          className="place-image"
          alt=""
        />
      </div>
      <div className="posting-info">
        <div>
          <StarRating rating={review.starRate} />
        </div>
        <div className="posting-title">{review.reviewTitle}</div>
        <div className="place-title">{review.placeTitle}</div>
        <div className="place-addr">{review.placeAddr}</div>
        <div
          dangerouslySetInnerHTML={{
            __html: review.reviewContent, // p 태그 제거
          }}
        />
        <div className="posting-sub-info">
          <span>{review.memberNickname}</span>
          <span>{review.reviewDate}</span>
        </div>
      </div>
    </li>
  );
};
export default ReviewMain;
