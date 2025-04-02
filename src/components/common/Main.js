import { useState } from "react";
import IntroSlider from "./IntroSlide";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import RecommandSlider from "./RecommandSlider";
import "./main.css";
import FavoriteIcon from "@mui/icons-material/Favorite";

const Main = () => {
  const planCategory = ["인기", "최신", , "혼자", "단체"];
  const contentCategory = ["여행지", "숙소", "음식", "쇼핑", "레저"];

  return (
    <section className="section main-wrap">
      <IntroSlider />
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>추천플랜</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel categories={planCategory} />
        </div>
        <RecommandSlider />
      </div>
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>추천 컨텐츠</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel categories={contentCategory} />
        </div>
        <RecommandSlider />
      </div>
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>인기 리뷰</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel categories={contentCategory} />
        </div>
        <div className="hot-review-wrap">
          <div className="main-review">
            <ReviewCard />
          </div>
          <div className="other-review-wrap">
            <div className="other-review">
              <ReviewCard />
              <ReviewCard />
            </div>
            <div className="other-review">
              <ReviewCard />
              <ReviewCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FilterNavWithPanel = ({ categories }) => {
  const [value, setValue] = useState(0);
  const handleChange = (_, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        p: 1,
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="category tabs"
        indicatorColor="primary"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#27b778", // 여기에서 커스터마이징!
          },
        }}
      >
        {categories.map((category, index) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>
    </Box>
  );
};
const ReviewCard = () => {
  return (
    <div
      className="review-card"
      style={{
        backgroundImage: `url(/image/dora.png)`,
        backgroundSize: "cover",
        width: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="heart-icon">
        <FavoriteIcon style={{ color: "#4CAF50" }} />
      </div>
      <div className="card-content">
        <h3 className="title">남산순환나들길</h3>
        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="score">5.0 (22)</span>
        </div>
        <p className="category">국립공원</p>
      </div>
    </div>
  );
};

export default Main;
