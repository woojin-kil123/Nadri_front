import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import axios from "axios";
import { MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminReview = () => {
  const navigate = useNavigate();
  const placeType = useRecoilValue(placeTypeState);
  const [selectedType, setSelectedType] = useState(placeType[0].id);
  const [hotReview, setHotReview] = useState(null);
  const [reportedReview, setReportedReview] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    if (!selectedType) return;
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/review/hotReview?type=${selectedType}`
      )
      .then((res) => {
        setHotReview(res.data);
      });
  }, [selectedType]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/report`)
      .then((res) => {
        console.log(res.data);
        setReportedReview(res.data);
      });
  }, [isUpdate]);
  const handleChange = (event) => {
    setSelectedType(event.target.value);
  };
  return (
    <>
      <div className="hot-review-wrap">
        <div className="hot-review-title">
          <h2>인기 리뷰</h2>
          <Select
            notched={false}
            labelId="hot-review-label"
            id="hot-review"
            value={selectedType}
            onChange={handleChange}
          >
            {placeType.map((type, i) => (
              <MenuItem key={"type-" + i} value={type.id}>
                {type.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <table className="hot-review tbl">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: "30%" }}>장소</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "15%" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {hotReview &&
              hotReview.map((review, i) => (
                <tr key={"review" + i}>
                  <td
                    onClick={() => {
                      navigate(`/review/detail/${review.reviewNo}`);
                    }}
                    style={{ cursor: "pointer" }}
                    className="review-hover"
                  >
                    {review.reviewNo}
                  </td>
                  <td>{review.reviewTitle}</td>
                  <td
                    onClick={() => {
                      navigate(`/place/detail/${review.placeId}`);
                    }}
                    style={{ cursor: "pointer" }}
                    className="review-hover"
                  >
                    {review.placeTitle}
                  </td>
                  <td>{review.memberNickname}</td>
                  <td>{review.reviewDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="reported-review warp">
        <div className="hot-review-title">
          <h2>신고 리뷰</h2>
        </div>
        <table className="hot-review tbl">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: "20%" }}>작성자</th>
              <th style={{ width: "20%" }}>신고자</th>
              <th style={{ width: "20%" }}>신고사유</th>
              <th style={{ width: "20%" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {reportedReview &&
              reportedReview.map((review, i) => (
                <tr key={"review" + i}>
                  <td
                    onClick={() => {
                      navigate(`/review/detail/${review.reviewNo}`);
                    }}
                    style={{ cursor: "pointer" }}
                    className="review-hover"
                  >
                    {review.reviewNo}
                  </td>
                  <td>{review.reviewTitle}</td>
                  <td>{review.memberNickname}</td>
                  <td>{review.reportNickname}</td>
                  <td>{review.reportReason}</td>
                  <td>{review.reviewDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default AdminReview;
