import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import axios from "axios";

import "./place.css";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";
import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "../utils/RecoilData";

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
    { id: 1, name: "관광지" }, //spot
    { id: 2, name: "즐길거리" }, //todo
    { id: 3, name: "숙박" }, //stay
    { id: 4, name: "음식점" }, //food
  ];
  const [selectedMenu, setSelectedMenu] = useState(0); // 0: 전체, 1:관광지, 2:즐길거리, 3:숙박, 4:음식점
  const [order, setOrder] = useState(1); // 리뷰 많은순 : 1, 별점 높은순 : 2, 좋아요 많은 순 : 3
  const changeOrder = (e) => {
    setOrder(e.target.value);
  };

  useEffect(() => {
    if (selectedMenu === 0) {
      axios
        .get(
          `${backServer}/place?reqPage=${reqPage}&order=${order}` +
            (isLogin ? `&memberNickname=${memberNickname}` : "")
        )
        .then((res) => {
          console.log(res.data);
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
          selectedMenu, // ← 메뉴 ID (1~4)
          filters: selectedFilters, // ← 한글 필터명 리스트
          reqPage,
          order,
          ...(isLogin && { memberNickname }),
        })
        .then((res) => {
          console.log(res.data);
          setPlaceList(res.data.list);
          setPi(res.data.pi);
          setTotalCount(res.data.totalCount);
        })
        .catch((err) => {
          console.log("세부필터 목록 조회 실패", err);
        });
    }
  }, [reqPage, selectedMenu, selectedFilters, order]);

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
                <option value={3}>좋아요 많은순</option>
              </select>
            </div>
          </div>
          <div className="place-wrap">
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
