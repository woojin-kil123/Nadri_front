import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Box, Pagination, Stack, Tab, Tabs } from "@mui/material";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";
import StarRating from "../utils/StarRating";
import ToggleBookmark from "../planner/utils/ToggleBookmark";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const [placeResult, setPlaceResult] = useState(null);
  const [planResult, setPlanResult] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [onContent, setOnContent] = useState(1);
  const contentType = [
    { id: 1, name: "여행 정보" },
    { id: 2, name: "플랜" },
    { id: 3, name: "리뷰" },
  ];
  useEffect(() => {
    setQuery(queryParams.get("query"));
    setTypeId(queryParams.getAll("type"));
  }, [location]);
  useEffect(() => {
    if (query || typeId) {
      axios
        .get(`${process.env.REACT_APP_BACK_SERVER}/search?query=${query}`)
        .then((res) => {
          console.log(res.data);
          setPlaceResult(res.data.place);
          setPlanResult(res.data.plan);
          setReviewResult(res.data.review);
        });
    }
  }, [query, typeId]);
  return (
    <>
      <h1>{query ? `${query}` : ""} 검색결과</h1>
      <section className="section search-result">
        <FilterNavWithPanel
          categories={contentType}
          on={onContent}
          setOn={setOnContent}
        />
        <div className="result-wrap">
          {onContent === 1 && (
            <Result
              result={placeResult || { list: [] }}
              onContent={onContent}
            />
          )}
          {onContent === 2 && (
            <Result result={planResult || { list: [] }} onContent={onContent} />
          )}
          {onContent === 3 && (
            <Result
              result={reviewResult || { list: [] }}
              onContent={onContent}
            />
          )}
        </div>
      </section>
    </>
  );
};
export default SearchResult;

const FilterNavWithPanel = ({ categories, on, setOn }) => {
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

const Result = ({ result, onContent }) => {
  const [index, setIndex] = useState(1);
  const [showList, setShowList] = useState([]);

  useEffect(() => {
    setIndex(1);
  }, [result]);

  useEffect(() => {
    if (Array.isArray(result?.list)) {
      const sliced = result.list.slice((index - 1) * 9, index * 9);
      setShowList(sliced);
    } else {
      setShowList([]);
    }
  }, [index, result]);

  // 콘솔 확인
  console.log("✅ result:", result);
  console.log("📄 result.list length:", result?.list?.length);
  console.log("📦 showList:", showList);

  // list가 없거나 빈 배열이면 메시지 출력
  if (!Array.isArray(result?.list) || result.list.length === 0) {
    return (
      <h3 style={{ textAlign: "center", marginTop: "2rem" }}>
        검색결과가 없습니다.
      </h3>
    );
  }

  return (
    <>
      <div className="place-wrap">
        {onContent === 1 &&
          showList.map((item) => (
            <ListCard key={"PlaceCard-" + item.placeId} place={item} />
          ))}
        {onContent === 2 &&
          showList.map((item) => (
            <PlanCard key={"planCard-" + item.planNo} plan={item} />
          ))}
        {onContent === 3 &&
          showList.map((item) => (
            <ReviewCard key={"ReviewCard-" + item.reviewNo} review={item} />
          ))}
      </div>
      <div className="pageNavi-box">
        <Stack spacing={2}>
          <Pagination
            page={index}
            onChange={(e, value) => setIndex(value)}
            count={Math.ceil(result.list.length / 9)}
            sx={{
              "& .Mui-selected": {
                backgroundColor: "var(--main2)",
                color: "#fff",
                borderRadius: "50%",
              },
              "& .MuiPaginationItem-root": {
                borderRadius: "50%",
              },
            }}
          />
        </Stack>
      </div>
    </>
  );
};

const PlanCard = ({ plan }) => {
  const [bookmarked, setBookmarked] = useState(null);
  const navigate = useNavigate();
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
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // 이벤트 버블링 방지
          }}
        >
          <ToggleBookmark bookmarked={bookmarked} />
        </div>
      </div>
      <div className="card-content">
        <h3 className="title">{plan.planName}</h3>
        <p className="description">작성자 : {plan.memberNickname}</p>
        <p className="date">
          {plan.startDate}~{plan.endDate}
        </p>
      </div>
    </div>
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
        borderRadius: "10px",
        marginBottom: "20px",
        cursor: "pointer",
      }}
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="card-content" style={{ width: "100%" }}>
        <StarRating rating={review.starRate} />
        <p className="score">{review.placeTitle}</p>
        <h3 className="title">{review.reviewTitle}</h3>
        <p className="writer">글쓴이: {review.memberNickname}</p>
      </div>
    </div>
  );
};
