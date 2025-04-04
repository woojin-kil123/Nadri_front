import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import PlaceListFrm from "./PlaceListFrm"; // ← 이름 반영 완료
import "./place.css"; // ← CSS 파일명도 일치시키는 걸 추천
import ListCard from "../utils/ListCard";

const PlaceList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { menuType } = useParams();
  const location = useLocation();
  const [cards, setCards] = useState([]);

  const [placeList, setPlaceList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);

  const menus = [
    { id: "12", name: "관광지", name2: "spot" },
    { id: "14", name: "즐길거리", name2: "todo" },
    { id: "32", name: "숙박", name2: "stay" },
    { id: "39", name: "음식점", name2: "food" },
  ];

  const currentMenu = menus.find((m) => m.name2 === menuType) || menus[0];

  useEffect(() => {
    if (!currentMenu) return;
    axios
      .get(`${backServer}/place/spot?reqPage=1`)
      .then((res) => {
        console.log(res);
        setCards(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, menuType]);

  return (
    <div className="place-wrap">
      <div className="page-title">여기서 여행지 조회</div>
      <div className="page-content">
        <div className="placelist-side">
          <section className="section menu-box">
            <LeftSideMenu menus={menus} />
            <Routes>
              <Route
                path=":menuType"
                element={
                  <PlaceListFrm
                    placeTypeId={currentMenu.id}
                    placeList={placeList}
                    pi={pi}
                  />
                }
              />
            </Routes>
          </section>
        </div>
        <div className="placelist-content">
          <div className="place-wrap">
            <div className="card-grid">
              {Array.isArray(cards) &&
                cards.map((card, i) => (
                  <ListCard key={"card-" + i} place={card} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceList;
