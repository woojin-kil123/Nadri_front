import axios from "axios";
import { useEffect, useState } from "react";
import { getKoreanToday } from "../utils/metaSet";

const AdminPartner = () => {
  const [popular, setPopular] = useState();
  const today = getKoreanToday();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/search/popular?date=${today}`)
      .then((res) => {
        console.log(res.data);
        setPopular(res.data);
      });
  }, []);
  return (
    <div className="hot-keyword-wrap">
      <h2>인기 검색어</h2>
      <div className="popular">
        {popular && (
          <>
            <div>
              <h4>일간</h4>
              {popular.daily.map((p, i) => (
                <p key={"daily-" + i}>
                  {p.query}/{p.count}회
                </p>
              ))}
            </div>
            <div>
              <h4>주간</h4>
              {popular.weekly.map((p, i) => (
                <p key={"weekly-" + i}>
                  {p.query}/{p.count}회
                </p>
              ))}
            </div>
            <div>
              <h4>월간</h4>
              {popular.monthly.map((p, i) => (
                <p key={"monthly-" + i}>
                  {p.query}/{p.count}회
                </p>
              ))}
            </div>
            <div>
              <h4>연간</h4>
              {popular.yearly.map((p, i) => (
                <p key={"yearly-" + i}>
                  {p.query}/{p.count}회
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <h2>검색 키워드 등록</h2>
      <div className="keyword-mange"></div>
    </div>
  );
};
export default AdminPartner;
