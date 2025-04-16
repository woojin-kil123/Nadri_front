import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import axios from "axios";
import "./place.css";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";
import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "../utils/RecoilData";
import { convertFiltersToCodes } from "../utils/FilterMap";

const PlaceList = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [totalCount, setTotalCount] = useState();

  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const [cards, setCards] = useState([]);

  const [placeList, setPlaceList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const menus = [
    { id: 12, name: "관광지" }, //spot
    { id: 14, name: "즐길거리" }, //todo
    { id: 32, name: "숙박" }, //stay
    { id: 39, name: "음식점" }, //food
  ];
  const [selectedPlaceTypeId, setSelectedPlaceTypeId] = useState(0); // 0: 전체, 1:관광지, 2:즐길거리, 3:숙박, 4:음식점
  const [order, setOrder] = useState(1); // 리뷰 많은순 : 1, 별점 높은순 : 2, 좋아요 많은 순 : 3
  const changeOrder = (e) => {
    setOrder(e.target.value);
  };

  const filterCodes = convertFiltersToCodes(
    selectedPlaceTypeId,
    selectedFilters
  );

  useEffect(() => {
    if (selectedPlaceTypeId === 0) {
      axios
        .get(
          `${backServer}/place?reqPage=${reqPage}&order=${order}` +
            (isLogin ? `&memberNickname=${memberNickname}` : "")
        )
        .then((res) => {
          setPlaceList(res.data.list);
          setPi(res.data.pi);
          setTotalCount(res.data.totalCount);
        })
        .catch((err) => {
          console.log("전체목록 조회 실패", err);
        });
    } else {
      axios
        .post(`${backServer}/place/filter`, {
          placeTypeId: selectedPlaceTypeId, // ← 메뉴 : selectedPlaceTypeId
          filterCodes,
          reqPage: reqPage,
          order: order,
          ...(isLogin && { memberNickname }),
        })
        .then((res) => {
          setPlaceList(res.data.list);
          setPi(res.data.pi);
          setTotalCount(res.data.totalCount);
        })
        .catch((err) => {
          console.log("세부필터 목록 조회 실패", err);
        });
    }
  }, [reqPage, selectedPlaceTypeId, selectedFilters, order]);

  return (
    <div className="place-wrap">
      <div className="page-title">나드리와 함께 나들이를 계획해요</div>
      <div className="page-content">
        <div className="placelist-side">
          <section className="section menu-box">
            <LeftSideMenu
              menus={menus}
              selectedMenu={selectedPlaceTypeId}
              setSelectedMenu={setSelectedPlaceTypeId}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </section>
        </div>
        <div className="placelist-content">
          <div className="placelist option-box">
            {totalCount && <div>총 {totalCount.toLocaleString()}개</div>}
            <div>
              <select onChange={changeOrder}>
                <option value={1}>리뷰 많은순</option>
                <option value={2}>별점 높은순</option>
                <option value={3}>추천순</option>
              </select>
            </div>
          </div>
          <div className="place-card-wrap">
            {Array.isArray(cards) &&
              placeList.map((card, i) => {
                return <ListCard key={"card-" + i} place={card} />;
              })}
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
