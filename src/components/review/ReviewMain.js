import { useState } from "react";
import { Link } from "react-router-dom";
import { RecoilState, useRecoilValue } from "recoil";
import "./review.css";
import { colors } from "@mui/material";
const ReviewMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [ReviewMain, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [content, setContnet] = useState(null);
  return (
    <section className="section">
      <div className="page-title">최신리뷰</div>
      <div className="nav-wrap">
        <nav className="nav">
          <ul>
            <li style={{ width: "15%" }}>
              <Link to="#">숙소</Link>
            </li>
            <li style={{ width: "15%" }}>
              <Link to="#">여행지</Link>
            </li>
            <li style={{ width: "15%" }}>
              <Link to="#">음식</Link>
            </li>
            <li style={{ width: "15%" }}>
              <Link to="#">즐길거리</Link>
            </li>
            <li style={{ width: "15%" }}>
              <Link to="#">플래너</Link>
            </li>
          </ul>
        </nav>
        <div>
          <Link to="#" className="btn-primary" style={{ color: "white" }}>
            글쓰기
          </Link>
        </div>
      </div>
    </section>
  );
};
const ReviewList = () => {
  return (
    <section className="section">
      <div></div>
    </section>
  );
};
export default ReviewMain;
