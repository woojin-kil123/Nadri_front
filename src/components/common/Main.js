import { useEffect, useState } from "react";
import IntroSlider from "./IntroSlide";
import { Box, CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import RecommandSlider from "./RecommandSlider";
import "./main.css";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import { getKoreanToday } from "../utils/metaSet";
import EventPopup from "../utils/EventPopup";
import StarRating from "../utils/StarRating";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const [planCategory, setPlanCategory] = useState([
    {
      name: "인기",
      id: 1,
    },
    {
      name: "최신",
      id: 0,
    },
  ]);
  const placeType = useRecoilValue(placeTypeState);
  //기본 타입 지정
  const [onPlan, setOnPlan] = useState(1);
  const [onPlace, setOnPlace] = useState(null);
  const [onReview, setOnReview] = useState(null);

  useEffect(() => {
    if (Array.isArray(placeType) && placeType.length > 0) {
      setOnPlan(1);
      setOnPlace(placeType[0].id);
      setOnReview(placeType[0].id);
    }
  }, []);
  //리뷰 조회
  const [hotReview, setHotReveiw] = useState(null);
  useEffect(() => {
    onReview &&
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/review?reqPage=1&type=${onReview}`
        )
        .then((res) => {
          setHotReveiw(res.data.list);
        });
  }, [onReview]);
  //팝업끄기
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const today = getKoreanToday(); // ex) "2025-04-10"
    const hiddenDate = localStorage.getItem("hidePopupDate");
    if (hiddenDate !== today) {
      setShowPopup(true);
    }
  }, []);

  const dailyClose = () => {
    const today = getKoreanToday();
    localStorage.setItem("hidePopupDate", today);
    setShowPopup(false);
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // ⏱ 2초 후 로딩 해제
    return () => clearTimeout(timer); // cleanup
  }, []);
  return (
    <section className="section main-wrap">
      {loading && (
        <div className="loading">
          <CircularProgress
            size={60}
            thickness={3}
            color="inherit"
            sx={{
              "& circle": {
                stroke: "#27b778",
              },
            }}
          />
          <div className="spinner-wrap">
            <img
              src="/image/nadri_logo.svg"
              alt="로딩 중"
              className="loading-image"
            />
            <p className="loading-text">잠시만 기다려 주세요...</p>
          </div>
        </div>
      )}
      {showPopup && (
        <EventPopup
          onClose={() => {
            setShowPopup(false);
          }}
          dailyClose={dailyClose}
        />
      )}
      <IntroSlider />
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>추천 플랜</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel
            categories={planCategory}
            on={onPlan}
            setOn={setOnPlan}
          />
        </div>
        <RecommandSlider on={onPlan} content="plan" />
      </div>
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>추천 컨텐츠</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel
            categories={placeType}
            on={onPlace}
            setOn={setOnPlace}
          />
        </div>
        <RecommandSlider on={onPlace} content="place" />
      </div>
      <div className="recommand-wrap">
        <div className="recommand-title">
          <h2>인기 리뷰</h2>
        </div>
        <div className="recommand-nav">
          <FilterNavWithPanel
            categories={placeType}
            on={onReview}
            setOn={setOnReview}
          />
        </div>
        {hotReview && (
          <div className="hot-review-wrap">
            <div className="main-review">
              {hotReview[0] && <ReviewCard review={hotReview[0]} />}
            </div>
            <div className="other-review-wrap">
              <div className="other-review">
                {hotReview[1] && <ReviewCard review={hotReview[1]} />}
                {hotReview[2] && <ReviewCard review={hotReview[2]} />}
              </div>
              <div className="other-review">
                {hotReview[3] && <ReviewCard review={hotReview[3]} />}
                {hotReview[4] && <ReviewCard review={hotReview[4]} />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

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
const ReviewCard = ({ review }) => {
  const navigate = useNavigate();
  const thumbUrl = review.placeThumb || "/image/default_img.png";
  return (
    <div
      className="review-card"
      style={{
        backgroundImage: `url(${thumbUrl})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="card-content">
        <StarRating rating={review.starRate} />
        <p className="score">{review.placeTitle}</p>
        <h3 className="title">{review.reviewTitle}</h3>
        <p className="writer">글쓴이: {review.memberNickname}</p>
      </div>
    </div>
  );
};

export default Main;
