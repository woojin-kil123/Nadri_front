import { useState } from "react";
import { Link } from "react-router-dom";
import { RecoilState, useRecoilValue } from "recoil";

const ReviewMain = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [ReviewMain, setReview] = useState([]);
  const [pi, setPi] = useState([]);
  const [reqPage, setReqPage] = useState(1);

  return (
    <section className="section">
      <div className="page-title">최신리뷰</div>
      <div className="nav-wrap">
        <nav className="nav">
          <ul>
            <li>
              <Link to="#">숙소</Link>
            </li>
            <li>
              <Link to="#">여행지</Link>
            </li>
            <li>
              <Link to="#">음식</Link>
            </li>
            <li>
              <Link to="#">즐길거리</Link>
            </li>
            <li>
              <Link to="#">플래너</Link>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
};
export default ReviewMain;
