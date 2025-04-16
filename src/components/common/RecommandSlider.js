import { useEffect, useState } from "react";
import Slider from "react-slick";
import ListCard from "../utils/ListCard";
import axios from "axios";
import { PlaceFilterRequest } from "../utils/metaSet";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import ToggleBookmark from "../planner/utils/ToggleBookmark";

export default function RecommandSlider({ on, content }) {
  const [cards, setCards] = useState(null);
  const loginNickname = useRecoilValue(loginNicknameState);
  useEffect(() => {
    switch (content) {
      case "place":
        const request = new PlaceFilterRequest(on, 1, 1);
        axios
          .post(`${process.env.REACT_APP_BACK_SERVER}/place/filter`, request)
          .then((res) => {
            setCards(res.data.list);
          })
          .catch((err) => {
            console.log(err);
          });

        break;
      case "plan":
        //플랜 조회
        axios
          .get(
            `${
              process.env.REACT_APP_BACK_SERVER
            }/plan?reqPage=${1}&order=${on}&loginNickname=${
              loginNickname ? loginNickname : ""
            }`
          )
          .then((res) => {
            console.log(res.data);
            setCards(res.data);
          });
        break;
    }
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
      {content === "place" && (
        <Slider {...settings}>
          {Array.isArray(cards) &&
            cards.map((card, i) => (
              <ListCard key={"PlaceCard-" + i} place={card} />
            ))}
        </Slider>
      )}
      {content === "plan" && (
        <Slider {...settings}>
          {Array.isArray(cards) &&
            cards.map((card, i) => (
              <PlanCard key={"planCard-" + i} plan={card} />
            ))}
        </Slider>
      )}
    </div>
  );
}

const PlanCard = ({ plan }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(plan.bookmarked);
  return (
    <div className="card" onClick={() => navigate(`/planner/${plan.planNo}`)}>
      <div className="image-container">
        <img
          src={
            plan.planThumb
              ? `${process.env.REACT_APP_BACK_SERVER}/assets/plan/thumb/${plan.planThumb}`
              : "/image/dora.png"
          }
          className="card-image"
        />

        <ToggleBookmark
          bookmarked={bookmarked}
          setBookmarked={setBookmarked}
          objectNo={plan.planNo}
          controllerUrl={"/plan"}
        />
      </div>
      <div className="card-content">
        <h3 className="title">{plan.planName}</h3>
        <p className="description">작성자 : {plan.memberNickname}</p>
        <p className="date">
          {plan.startDate} ~ {plan.endDate}
        </p>
      </div>
    </div>
  );
};
