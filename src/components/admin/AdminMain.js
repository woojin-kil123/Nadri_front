import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";

const AdminMain = () => {
  const placeType = useRecoilValue(placeTypeState);
  const [reviewStat, setReviewStat] = useState(null);
  const [company, setCompany] = useState(null);
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
      </div>
      {company && (
        <div className="update-info">
          <h1>회사 정보</h1>
          <div>대표전화</div>
          <div>FAX</div>
          <div>이메일</div>
        </div>
      )}
    </>
  );
};
export default AdminMain;
