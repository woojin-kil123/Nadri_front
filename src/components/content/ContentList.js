import { useEffect, useState } from "react";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ContentListFrm from "./ContentListFrm"; // ← 변경된 이름
import "./content.css";

const ContentList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const { menuType } = useParams();
  const location = useLocation();

  const [contentList, setContentList] = useState([]);
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
      .get(
        `${backServer}/content?reqPage=${reqPage}&contentTypeId=${currentMenu.id}`
      )
      .then((res) => {
        console.log(res);
        setContentList(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reqPage, menuType]);

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
          <ul className="tour-wrap">
            <Routes>
              <Route
                path=":menuType"
                element={
                  <ContentListFrm
                    contentTypeId={currentMenu.id}
                    contentList={contentList}
                    pi={pi}
                  />
                }
              />
            </Routes>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentList;
