import { useState } from "react";
import Slider from "react-slick";
import ListCard from "../utils/ListCard";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

export default function RecommandSlider() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true, // ✅ 기본 화살표 사용!
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // 나중에 selected에 따라 필터링된 데이터 가져올 수도 있음
  const cards = Array(10).fill(null); // 임시 카드
  return (
    <div className="recommand-slider">
      <Slider {...settings}>
        {cards.map((_, i) => (
          <ListCard key={i} />
        ))}
      </Slider>
    </div>
  );
}
