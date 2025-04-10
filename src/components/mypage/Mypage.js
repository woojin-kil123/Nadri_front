import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import Planners from "./Planners";
import Reviews from "./Reviews";
import Bookmark from "./Bookmark";
import { useRecoilValue } from "recoil";
import { isLoginState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import LeftSideMenu from "./LeftSideMenu";
import "./mypage.css";
import "./LeftSideMenu";
import UpdateInfo from "./UpdateInfo";

const Mypage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 URL 정보 가져오기
  const isLogin = useRecoilValue(isLoginState);
  const [menus, setMenus] = useState([
    { url: "/mypage/userInfo", text: "내 정보 관리" },
    { url: "/mypage/planners", text: "내 플래너 관리" },
    { url: "/mypage/bookmark", text: "즐겨찾기" },
    { url: "/mypage/reviews", text: "내 리뷰 관리" },
  ]);

  // 마이페이지에 들어오면 자동으로 내 정보 관리 페이지로 이동하도록 설정
  useEffect(() => {
    if (location.pathname === "/mypage") {
      navigate("/mypage/userinfo"); // 마이페이지 기본 경로에 오면 내 정보 관리 페이지로 리다이렉트
    }
  }, [location, navigate]);

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
