import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import axios from "axios";
import { Box, Tab, Tabs } from "@mui/material";

const AdminReview = () => {
  const placeType = useRecoilValue(placeTypeState);
  const [selectedType, setSelectedType] = useState(placeType[0].id);
  const [hotReview, setHotReview] = useState(null);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/review/hotReview?type=${selectedType}`
      )
      .then((res) => {
        console.log(res.data);
        setHotReview(res.data);
      });
  }, [selectedType]);
  return (
    <>
      <FilterNavWithPanel
        categories={placeType}
        on={selectedType}
        setOn={setSelectedType}
      />
      <div className="hot-review-wrap">
        <h3>인기리뷰</h3>
        <table className="hot-review tbl">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>리뷰 번호</th>
              <th style={{ width: "30%" }}>제목</th>
              <th style={{ width: "20%" }}>작성자</th>
              <th style={{ width: "20%" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {hotReview &&
              hotReview.map((review, i) => (
                <tr key={"review" + i}>
                  <td>{review.reviewNo}</td>
                  <td>{review.reviewTitle}</td>
                  <td>{review.memberNickname}</td>
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

const FilterNavWithPanel = ({ categories, on, setOn }) => {
  const placeType = useRecoilValue(placeTypeState);
  const tabIndex = categories.findIndex((type) => type.id === on); // 문자열인 on → index 변환

  const handleChange = (_, newIndex) => {
    const selected = categories[newIndex].id;
    setOn(selected);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", p: 1 }}>
      <Tabs
        value={tabIndex === -1 ? 0 : tabIndex}
        onChange={handleChange}
        aria-label="category tabs"
        indicatorColor="primary"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#27b778",
          },
        }}
      >
        {categories.map((category, i) => (
          <Tab key={category.id + "-" + i} label={category.name} />
        ))}
      </Tabs>
    </Box>
  );
};
