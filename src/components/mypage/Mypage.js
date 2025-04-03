import { Route, Routes, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import Planners from "./Planners";
import Reviews from "./Reviews";
import Bookmark from "./Bookmark";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { useState } from "react";
import LeftSideMenu from "./LeftSideMenu";
import "./mypage.css";
import "./LeftSideMenu";
import UpdateInfo from "./UpdateInfo";
import Withdraw from "./Withdraw";

const Mypage = () => {
  const navigate = useNavigate();
  const isLogin = useRecoilValue(isLoginState);
  const [menus, setMenus] = useState([
    { url: "/mypage/userInfo", text: "내 정보 관리" },
    { url: "/mypage/planners", text: "내 플래너 관리" },
    { url: "/mypage/bookmark", text: "즐겨찾기" },
    { url: "/mypage/reviews", text: "내 리뷰 관리" },
  ]);

  return (
    <div className="mypage-wrap">
      <div className="mypage-side">
        <section className="section account-box">
          <div>마이페이지</div>
        </section>
        <section className="section">
          <LeftSideMenu menus={menus} />
        </section>
      </div>

      <div className="mypage-content">
        <section className="section">
          <Routes>
            <Route path="userinfo" element={<UserInfo />} />
            <Route path="planners" element={<Planners />} />
            <Route path="bookmark" element={<Bookmark />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="updateInfo" element={<UpdateInfo />} />
          </Routes>
        </section>
      </div>
    </div>
  );
};

export default Mypage;
