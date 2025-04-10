import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import "./place.css";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";

const PlaceList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [totalCount, setTotalCount] = useState();

  const [cards, setCards] = useState([]);

  const [placeList, setPlaceList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const menus = [
    { id: 12, name: "관광지", name2: "spot" },
    { id: 14, name: "즐길거리", name2: "todo" },
    { id: 32, name: "숙박", name2: "stay" },
    { id: 39, name: "음식점", name2: "food" },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0); // 0: 전체, 12:관광지, 14:즐길거리, 32:숙박, 39:음식점

  useEffect(() => {
    axios
      .get(`${backServer}/place?reqPage=${reqPage}&placeTypeId=${selectedMenu}`)
      .then((res) => {
        console.log(res.data);
        setPlaceList(res.data.list);
        setPi(res.data.pi);
        setTotalCount(res.data.totalCount);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, selectedMenu]);

  return (
    <div className="place-wrap">
      <div className="page-title">여기서 여행지 조회</div>
      <div className="page-content">
        <div className="placelist-side">
          <section className="section menu-box">
            <LeftSideMenu
              menus={menus}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
            />
          </section>
        </div>
        <div className="placelist-content">
          <div className="placelist option-box">
            {totalCount && <div>총 {totalCount.toLocaleString()}개</div>}
            <div>
              <select>
                <option value={1}>리뷰 많은순</option>
                <option value={2}>별점 높은순</option>
                <option value={3}>좋아요 많은순</option>
              </select>
            </div>
          </div>
          <div className="place-wrap">
            {Array.isArray(cards) &&
              placeList.map((card, i) => (
                <ListCard key={"card-" + i} place={card} />
              ))}
          </div>
          <div className="pageNavi-box">
            <PageNavigation pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceList;
