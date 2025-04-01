import { useEffect, useState } from "react";
import Spotlist from "./Spotlist";
import LeftSideMenu from "../utils/LeftSideMenu";
import { Route, Routes } from "react-router-dom";
import axios from "axios";

const ContentList = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [tourList, setTourList] = useState([]);
  const [pi, setPi] = useState({});
  const [reqPage, setPeqPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${backServer}/content?reqPage=${reqPage}`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [menus, setMenus] = useState([
    { url: "/content/spot", text: "관광지" },
    { url: "/content/todo", text: "즐길거리" },
    { url: "/content/stay", text: "숙박" },
    { url: "/content/food", text: "음식점" },
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
          <ul className="tour-wrap">
            <Routes>
              <Route path="spot" element={<Spotlist />} />
              <Route path="todo" />
              <Route path="stay" />
              <Route path="food" />
            </Routes>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ContentList;
