import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { RecoilState, useRecoilValue } from "recoil";
import "./review.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
const ReviewMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [review, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [content, setContnet] = useState(null);
  const chaneContnent = (value) => {
    setContnet(value);
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/review?reqPage=${reqPage}&value=${value}`
      )
      .then((res) => {
        console.log(res);
        setReview(res.data);
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
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("room");
              }}
            >
              숙소
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("spot");
              }}
            >
              관광지
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("food");
              }}
            >
              음식
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("todo");
              }}
            >
              즐길거리
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("plan");
              }}
            >
              플래너
            </li>
          </ul>
        </nav>
        <div>
          <Link to="/search" className="btn-primary green">
            글쓰기
          </Link>
        </div>
      </div>
      <div className="contnent-review-list">
        <div>{content}</div>
        <div className="review-paging-wrap">
          <PageNavigation pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
  );
};

export default ReviewMain;
