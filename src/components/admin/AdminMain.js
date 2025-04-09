import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IconButton } from "@mui/material";

const AdminMain = () => {
  const placeType = useRecoilValue(placeTypeState);
  const [reviewStat, setReviewStat] = useState(null);
  const [company, setCompany] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/stats`)
      .then((res) => {
        console.log(res.data);
        setReviewStat(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/company`)
      .then((res) => {
        setCompany(res.data);
      });
  }, [isUpdate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };
  const updateCompany = () => {
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/admin/company`, company)
      .then((res) => {
        console.log(res.data);
        if (res.data > 0) {
          setIsUpdate((prev) => !prev);
          setEditMode(false);
        }
      });
  };
  return (
    <>
      <div className="review-stats">
        <div className="total">
          <h2>총 통계</h2>
          <div>
            <h4>리뷰</h4>
            {reviewStat.map((review, i) => (
              <div>
                {review.placeTypeId}/{review.reviewCount}개
              </div>
            ))}
          </div>
        </div>
      </div>
      {company && (
        <div className="update-info">
          <div className="info-title">
            <h2>회사정보</h2>
            <IconButton
              onClick={() => {
                setEditMode((prev) => !prev);
              }}
              size="small"
            >
              <DriveFileRenameOutlineIcon
                sx={{ width: 30, height: 30, marginLeft: "4px", color: "#333" }}
              />
            </IconButton>
          </div>
          <form
            className="info-grid"
            onSubmit={(e) => {
              e.preventDefault();
              updateCompany();
            }}
          >
            <div className="info-block">
              <label>주소</label>
              <input
                name="addr"
                value={company.addr}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>대표전화</label>
              <input
                name="tel"
                value={company.tel}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>fax</label>
              <input
                name="fax"
                value={company.fax}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>이메일</label>
              <input
                name="email"
                value={company.email}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default AdminMain;
