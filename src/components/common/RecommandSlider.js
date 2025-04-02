import Slider from "react-slick";
import ListCard from "../utils/ListCard";
export default function RecommandSlider() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // 태블릿 이하에서는 2개씩
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640, // 모바일에서는 1개씩
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="recommand-slider">
      <Slider {...settings}>
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
        <ListCard />
      </Slider>
    </div>
  );
}
