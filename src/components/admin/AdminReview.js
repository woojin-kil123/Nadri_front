import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import axios from "axios";
import {
  Box,
  Button,
  ClickAwayListener,
  FormControl,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Select,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AdminReview = () => {
  const navigate = useNavigate();
  const placeType = useRecoilValue(placeTypeState);
  const [selectedType, setSelectedType] = useState(placeType[0].id);
  const [hotReview, setHotReview] = useState(null);
  const [reportedReview, setReportedReview] = useState(null);

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
  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };
  const [tab, setTab] = useState(1);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/report?status=${tab}`)
      .then((res) => {
        console.log(res.data);
        setReportedReview(res.data);
      });
  }, [tab]);
  const handleChange = (event) => {
    setSelectedType(event.target.value);
  };
  const handleStatusUpdate = (id, status) => {
    axios.patch(`/admin/report/${id}`, { status }).then(() => {});
  };
  const handleDelete = (id) => {
    axios.delete(`/admin/review/${id}`).then(() => {});
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
        <table className="hot-review review-tbl tbl">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>번호</th>
              <th style={{ width: "30%" }}>리뷰 제목</th>
              <th style={{ width: "30%" }}>장소</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "15%" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {hotReview &&
              hotReview.map((review, i) => (
                <tr key={"review" + i}>
                  <td>{review.reviewNo}</td>
                  <td
                    onClick={() => {
                      navigate(`/review/detail/${review.reviewNo}`);
                    }}
                    style={{ cursor: "pointer" }}
                    className="review-hover"
                  >
                    {review.reviewTitle}
                  </td>
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
        <Box>
          <Tabs value={tab} onChange={handleTabChange}>
            <Tab value={1} label="미처리 신고" />
            <Tab value={2} label="처리 완료" />
          </Tabs>

          {tab === 1 && (
            <table className="admin-table review-tbl tbl">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>신고자</th>
                  <th>사유</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {reportedReview &&
                  reportedReview.map((review, i) => (
                    <Report
                      key={"status1-" + i}
                      review={review}
                      navigate={navigate}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
              </tbody>
            </table>
          )}

          {tab === 2 && (
            <table className="admin-table review-tbl tbl">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>신고자</th>
                  <th>사유</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {reportedReview &&
                  reportedReview.map((review, i) => (
                    <Report
                      key={"status2-" + i}
                      review={review}
                      navigate={navigate}
                      onDelete={handleDelete}
                    />
                  ))}
              </tbody>
            </table>
          )}
        </Box>
      </div>
    </>
  );
};
export default AdminReview;

const Report = ({ navigate, review, onStatusUpdate, onDelete }) => {
  // Select 커스터마이징
  const StyledSelect = styled(Select)(({ theme }) => ({
    fontSize: 14,
    width: 100,
    height: 36,
    borderRadius: 8,
    padding: "0 10px",
    "& .MuiSelect-select": {
      padding: "8px 14px",
      display: "flex",
      alignItems: "center",
    },
  }));

  // 삭제 버튼 커스터마이징
  const DeleteButton = styled(Button)(({ theme }) => ({
    fontSize: 14,
    height: 36,
    marginLeft: 8,
    padding: "4px 16px",
    borderRadius: 8,
  }));
  const [status, setStatus] = useState(review.reportStatus);
  const handleDelete = () => {
    Swal.fire({
      icon: "warning",
      title: "리뷰 삭제",
      text: "해당 리뷰를 삭제하시겠습니까?",
      showConfirmButton: true,
      showCancelButton: true,
    }).then(() => {
      console.log("삭제 요청");
    });
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onStatusUpdate?.(review.reviewNo, newStatus);
  };

  return (
    <tr>
      <td>{review.reviewNo}</td>
      <td onClick={() => navigate(`/review/detail/${review.reviewNo}`)}>
        {review.reviewTitle}
      </td>
      <td>{review.memberNickname}</td>
      <td>{review.reportNickname}</td>
      <td>{review.reportReason}</td>
      <td>
        {onStatusUpdate ? (
          <StyledSelect value={status} onChange={handleStatusChange}>
            <MenuItem value={1}>미처리</MenuItem>
            <MenuItem value={2}>접수</MenuItem>
            <MenuItem value={3}>반려</MenuItem>
          </StyledSelect>
        ) : (
          <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
        )}
      </td>
    </tr>
  );
};
