import { useEffect, useState } from "react";
import Slider from "react-slick";
import ListCard from "../utils/ListCard";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import axios from "axios";

export default function RecommandSlider({ on }) {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/place?reqPage=1&placeCat=${on}`
      )
      .then((res) => {
        setCards(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [on]);
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

  return (
    <div className="recommand-slider">
      <Slider {...settings}>
        {Array.isArray(cards) &&
          cards.map((card, i) => <ListCard key={"card-" + i} place={card} />)}
      </Slider>
    </div>
  );
}
