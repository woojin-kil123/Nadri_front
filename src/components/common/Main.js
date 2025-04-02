import { useState } from "react";
import IntroSlider from "./IntroSlide";
import { Fab } from "@mui/material";
import RecommandSlider from "./RecommandSlider";

const Main = () => {
  return (
    <section className="section main-wrap">
      <IntroSlider />
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>추천 플랜</h2>
        </div>
        <div className="recommand-nav">
          <FilterNav />
        </div>
        <RecommandSlider />
      </div>
    </section>
  );
};

const FilterNav = () => {
  const categories = ["최신", "혼자", "커플/신혼", "가족들과", "친구들과"];
  const [selected, setSelected] = useState("최신");

  return (
    <div className="filter-nav">
      {categories.map((category) => (
        <Fab
          variant="extended"
          key={category}
          className={`filter-button ${selected === category ? "active" : ""}`}
          onClick={() => setSelected(category)}
        >
          {category}
        </Fab>
      ))}
    </div>
  );
};

export default Main;
