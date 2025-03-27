import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { RecoilState, useRecoilValue } from "recoil";
import "./review.css";
import { colors } from "@mui/material";
import axios from "axios";
import ReviewWrite from "./ReviewWrite";
const ReviewMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [Review, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [content, setContnet] = useState(null);
  const chaneContnent = (value) => {
    setContnet(value);
    console.log(value);
  };
  return (
    <section className="section">
      <div className="page-title">최신리뷰</div>
      <div className="nav-wrap">
        <nav className="nav">
          <ul>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("숙소");
              }}
            >
              숙소
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("여행지");
              }}
            >
              여행지
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("음식");
              }}
            >
              음식
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("즐길거리");
              }}
            >
              즐길거리
            </li>
            <li
              style={{ width: "15%" }}
              onClick={() => {
                chaneContnent("플래너");
              }}
            >
              플래너
            </li>
          </ul>
        </nav>
        <div>
          <Link to="/review/write" className="btn-primary">
            글쓰기
          </Link>
        </div>
      </div>
      <div className="contnent">
        <ReviewList data={content} />
      </div>
    </section>
  );
};
const ReviewList = (props) => {
  const content = props.data;
  /* useEffect(
    axios
      .get()
      .then((res) => {
        console.log(res);
        setReview(res.data);
      })
      .catch((err) => {
        console.log(err);
      }),

    []
  );*/
  return (
    <section className="section">
      <div>{content}</div>
    </section>
  );
};
export default ReviewMain;
