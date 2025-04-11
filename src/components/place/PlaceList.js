import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import "./place.css";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";
import { useRecoilValue } from "recoil";
import {
  isLoginState,
  loginNicknameState,
  memberNoState,
} from "../utils/RecoilData";

const PlaceList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [totalCount, setTotalCount] = useState();

  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const [cards, setCards] = useState([]);
  const [likedMap, setLikedMap] = useState({});

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

  // 좋아요 토글 핸들러
  const handleToggleLike = (placeId) => {
    console.log({ placeId, memberNickname });
    axios
      .post(`${backServer}/place/bookmark/toggle`, null, {
        params: {
          memberNickname: memberNickname,
          placeId: placeId,
        },
      })
      .then((res) => {
        const newStatus = res.data;
        const newMap = { ...likedMap }; // ✅ 새 객체 생성
        newMap[placeId] = newStatus;
        setLikedMap(newMap); // ✅ 완전히 새 객체로 교체해서 리렌더 유도
      })
      .catch((err) => {
        console.error("좋아요 토글 실패:", err);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${backServer}/place?reqPage=${reqPage}&placeTypeId=${selectedMenu}` +
          isLogin
          ? +`&memberNickname=${memberNickname}`
          : ""
      )
      .then((res) => {
        console.log(res.data);
        const list = res.data.list;
        setPlaceList(list);
        setPi(res.data.pi);
        setTotalCount(res.data.totalCount);

        // 북마크 상태는 로그인한 경우에만 요청
        if (memberNickname && list.length > 0) {
          const placeIds = list.map((place) => place.placeId);

          axios
            .get(`${backServer}/place/bookmark/status/list`, {
              params: {
                memberNickname: memberNickname,
                placeIds: placeIds.join(","),
              },
            })
            .then((res) => {
              const likedObj = {};
              res.data.forEach((item) => {
                likedObj[item.placeId] = item.bookmarked;
              });
              setLikedMap(likedObj);
            })
            .catch((err) => {
              console.error("북마크 상태 조회 실패:", err);
            });
        } else {
          // 비로그인 사용자일 경우, 모두 false로 초기화
          const likedObj = {};
          list.forEach((place) => {
            likedObj[place.placeId] = false;
          });
          setLikedMap(likedObj);
        }
      })
      .catch((err) => {
        console.log("장소목록 요청 실패", err);
      });
  }, [reqPage, selectedMenu, memberNickname]);

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
              placeList.map((card, i) => {
                return (
                  <ListCard
                    key={card.placeId}
                    place={card}
                    memberNickname={memberNickname}
                    liked={likedMap[card.placeId]}
                    onToggleLike={handleToggleLike}
                  />
                );
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
