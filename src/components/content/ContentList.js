import { useEffect, useState } from "react";
import Spotlist from "./Spotlist";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes } from "react-router-dom";
import axios from "axios";
import "./content.css";

const ContentList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [tourList, setTourList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setPeqPage] = useState(1);

  //리뷰 별점 평균, 게시글 수 불러왔다고 가정한 테스트데이터
  const reviewInfo = [
    { rating: 4.2, reviewCount: 12, contentId: 945221 },
    { rating: 5, reviewCount: 10, contentId: 3333975 },
    { rating: 3.8, reviewCount: 15, contentId: 2702643 },
    { rating: 3.4, reviewCount: 16, contentId: 129704 },
    { rating: 3.3, reviewCount: 15, contentId: 2679054 },
    { rating: 4.3, reviewCount: 60, contentId: 2603918 },
    { rating: 4.2, reviewCount: 30, contentId: 2995168 },
    { rating: 3.9, reviewCount: 22, contentId: 2749553 },
    { rating: 4.1, reviewCount: 10, contentId: 2603467 },
    { rating: 2.4, reviewCount: 6, contentId: 2599344 },
    { rating: 3.4, reviewCount: 25, contentId: 127076 },
    { rating: 4.6, reviewCount: 40, contentId: 2894013 },
  ];

  useEffect(() => {
    axios
      .get(`${backServer}/content?reqPage=${reqPage}`)
      .then((res) => {
        console.log(res);
        setTourList(res.data.list);
        // 1. 리뷰 정보를 Map으로 변환 (contentId 기준 빠른 조회용)
        const reviewMap = new Map();
        reviewInfo.forEach((review) => {
          reviewMap.set(review.contentId, {
            rating: review.rating,
            reviewCount: review.reviewCount,
          });
        });
        console.log(reviewMap);
        // 2. tourList 각 항목에 리뷰 정보 병합
        const mergedList = tourList.map((tour) => {
          const review = reviewMap.get(tour.contentId) || {
            rating: 0,
            reviewCount: 0,
          };
          return {
            ...tour,
            ...review, // rating, reviewCount 붙이기
          };
        });
        console.log(mergedList);

        // 3. 상태 저장
        setTourList(mergedList);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage]);

  const [menus, setMenus] = useState([
    { id: "12", name: "관광지", name2: "spot" },
    { id: "", name: "즐길거리", name2: "todo" },
    { id: "32", name: "숙박", name2: "stay" },
    { id: "39", name: "음식점", name2: "food" },
  ]);
  return (
    <div className="content-wrap">
      <div className="page-title">여기서 여행컨텐츠 조회</div>
      <div className="page-content">
        <div className="contentlist-side">
          <section className="section menu-box">
            <LeftSideMenu menus={menus} />
          </section>
        </div>
        <div className="contentlist-content">
          <ul className="tour-wrap"></ul>
        </div>
      </div>
    </div>
  );
};
export default ContentList;
