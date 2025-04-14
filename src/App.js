// 공통 컴포넌트
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./components/common/Main";
// 라우터 관련
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
// 멤버 관련 페이지
import Login from "./components/member/Login";
import LoginKakao from "./components/member/LoginKakao";
import SocialJoin from "./components/member/SocialJoin";
import SocialJoin2 from "./components/member/SocialJoin2";
import Join from "./components/member/Join";
import Join2 from "./components/member/Join2";
import Join3 from "./components/member/Join3";
// 여행 계획 관련
import UpdatePw from "./components/member/UpdatePw";
import UpdatePw2 from "./components/member/UpdatePw2";
import PlannerFrm from "./components/planner/PlannerFrm";
// 콘텐츠 및 리뷰
import PlaceList from "./components/place/PlaceList";
import ReviewMain from "./components/review/ReviewMain";
// 상태 관리
import { useRecoilState, useRecoilValue } from "recoil";
import {
  companyInfoState,
  isLoginState,
  isPlannerState,
  placeTypeState,
} from "./components/utils/RecoilData";
// 컴포넌트
import { useEffect, useState } from "react";
import ChatMenu from "./components/chat/ChatMenu";
import Mypage from "./components/mypage/Mypage";
import ReviewWrite from "./components/review/ReviewWrite";
import ReviewView from "./components/review/ReviewView";
import LoginRouting from "./components/utils/LoginRouting";
import AdminRouting from "./components/utils/AdminRouting";
// 슬릭 슬라이더 css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Admin from "./components/admin/Admin";
import Event from "./components/admin/Event";
import axios from "axios";
import SearchResult from "./components/search/SearchResult";
import AdminMain from "./components/admin/AdminMain";
import AdminReview from "./components/admin/AdminReview";
import AdminPartner from "./components/admin/AdminKeyword";
import PlaceDetail from "./components/place/PlaceDetail";
import EditReview from "./components/review/EditReview";

function App() {
  const [planner, setPlanner] = useRecoilState(isPlannerState);
  const [placeType, setPlaceType] = useRecoilState(placeTypeState);
  const [companyInfo, setCompanyInfo] = useRecoilState(companyInfoState);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_SERVER}/place/type`).then((res) => {
      setPlaceType(res.data);
      console.log(res.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/company`)
      .then((res) => {
        setCompanyInfo(res.data);
      });
  }, []);
  const isLogin = useRecoilValue(isLoginState);

  const loc = useLocation();

  useEffect(() => {
    if (loc.pathname === "/planner") {
      setPlanner(true);
    } else {
      setPlanner(false);
    }
  }, [loc.pathname]);
  const [chatEl, setChatEl] = useState(null);
  return (
    <>
      {isLogin && <ChatMenu chatEl={chatEl} setChatEl={setChatEl} />}

      <Routes>
        <Route
          path="/planner/:planNo?"
          element={<LoginRouting element={<PlannerFrm />} />}
        />

        <Route
          path="*"
          element={
            <div className="wrap">
              <Header />
              <div className="content">
                <Routes>
                  {/* <Route path="/planner" element={<PlannerFrm />} /> */}
                  <Route path="/" element={<Main />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/login/kakao" element={<LoginKakao />} />
                  <Route path="/socialJoin" element={<SocialJoin />} />
                  <Route path="/socialJoin2" element={<SocialJoin2 />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/join2" element={<Join2 />} />
                  <Route path="/join3" element={<Join3 />} />
                  <Route path="/updatePw" element={<UpdatePw />} />
                  <Route path="/updatePw2" element={<UpdatePw2 />} />
                  {/*<Route path="/mypage/*" element={<Mypage />} /> */}
                  <Route
                    path="/mypage/*"
                    element={<LoginRouting element={<Mypage />} />}
                  />
                  <Route path="/review" element={<ReviewMain />}></Route>
                  <Route
                    path="/admin/*"
                    element={<AdminRouting element={<Admin />} />}
                  >
                    <Route index element={<AdminMain />} />
                    <Route path="event" element={<Event />} />
                    <Route path="keyword" element={<AdminPartner />} />
                    <Route path="review" element={<AdminReview />} />
                    <Route path="member" element={<></>} />
                    <Route path="main" element={<AdminMain />} />
                  </Route>
                  <Route
                    path="/review/detail/:reviewNo"
                    element={<ReviewView />}
                  ></Route>
                  <Route
                    path="/review/write/:placeId"
                    element={<LoginRouting element={<ReviewWrite />} />}
                  ></Route>
                  <Route
                    path="/review/edit/:reviewNo"
                    element={<LoginRouting element={<EditReview />} />}
                  ></Route>
                  <Route path="/place" element={<PlaceList />} />
                  <Route
                    path="/place/detail/:placeId"
                    element={<PlaceDetail />}
                  />
                  <Route path="/search" element={<SearchResult />} />
                </Routes>
              </div>
              <Footer />
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
