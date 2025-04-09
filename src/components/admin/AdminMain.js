import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";

const AdminMain = () => {
  const placeType = useRecoilValue(placeTypeState);
  const [reviewStat, setReviewStat] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/stats`)
      .then((res) => {
        console.log(res.data);
        setReviewStat(res.data);
      });
  }, []);
  return (
    <>
      <div className="review-stats">
        <div className="total">
          <h1>총 통계</h1>
          <p> 내용</p>
        </div>
        {reviewStat &&
          reviewStat.map((stat, i) => (
            <div className="stat" key={`stat-${stat.placeTypeId}`}>
              <h3>
                {
                  placeType.find((type, _) => stat.placeTypeId === type.id)
                    ?.name
                }
              </h3>
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>총 리뷰</th>
                    <th style={{ width: "60%" }}>인기 리뷰</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={`stat-${stat.placeTypeId}`}>
                    <td>{stat.reviewCount}개</td>
                    <td>
                      {stat.hotReview.map((item, i2) => (
                        <table key={`hotReview-` + i2} className="tbl">
                          <thead>
                            <tr>
                              <th>번호</th>
                              <th>제목</th>
                              <th>작성자</th>
                              <th>작성일</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{item.reviewNo}</td>
                              <td>{item.reviewTitle}</td>
                              <td>{item.memberNickname}</td>
                              <td>{item.reviewDate}</td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
      </div>
    </>
  );
};
export default AdminMain;
