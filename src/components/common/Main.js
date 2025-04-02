import { useState } from "react";
import IntroSlider from "./IntroSlide";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import RecommandSlider from "./RecommandSlider";
import "./main.css";

const Main = () => {
  const planCategory = ["인기", "최신", , "혼자", "단체"];
  const contentCategory = ["여행지", "숙소", "음식", "쇼핑", "레저"];

  return (
    <section className="section main-wrap">
      <IntroSlider />
      <CategoryBlock title="추천 플랜" categories={planCategory} />
      <CategoryBlock title="추천 컨텐츠" categories={contentCategory} />
    </section>
  );
};

const CategoryBlock = ({ title, categories }) => {
  return (
    <div className="recommand-wrap">
      <div className="recommand-title">
        <h2>{title}</h2>
      </div>
      <div className="recommand-nav">
        <FilterNavWithPanel categories={categories} />
      </div>
      <RecommandSlider categories={categories} />
    </div>
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
          "& .MuiTab-root": {
            color: "#3d3d3d", // 기본 탭 텍스트 색상
          },
          "& .Mui-selected": {
            color: "#27b778",
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
export default Main;
