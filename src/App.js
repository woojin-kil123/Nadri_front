// 공통 컴포넌트
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Main from "./components/common/Main";
// 라우터 관련
import { Route, Routes, useLocation } from "react-router-dom";
// 멤버 관련 페이지
import Login from "./components/member/Login";
import Join from "./components/member/Join";
import Join2 from "./components/member/Join2";
import RePw from "./components/member/RePw";
import RePw2 from "./components/member/RePw2";
// 여행 계획 관련
import PlannerFrm from "./components/planner/PlannerFrm";
// 콘텐츠 및 리뷰
import ContentMain from "./components/content/ContentMain";
import ReviewMain from "./components/review/ReviewMain";
// 유틸리티
import MapInfo from "./components/utils/MapInfo";
// 상태 관리
import { useRecoilState } from "recoil";
import { isPlannerState } from "./components/utils/RecoilData";
// 리액트 훅
import { useEffect, useState } from "react";
import ChatMenu from "./components/chat/ChatMenu";

function App() {
  const [planner, setPlanner] = useRecoilState(isPlannerState);
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
      <ChatMenu chatEl={chatEl} setChatEl={setChatEl} />
      <Routes>
        <Route path="/planner" element={<PlannerFrm />} />
      </Routes>
      {!planner && (
        <div className="wrap">
          <Header />
          <div className="content">
            <Routes>
              {/* <Route path="/planner" element={<PlannerFrm />} /> */}
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/join" element={<Join />} />
              <Route path="/join2" element={<Join2 />} />
              <Route path="/rePw" element={<RePw />} />
              <Route path="/rePw2" element={<RePw2 />} />
              <Route path="/review/*" element={<ReviewMain />}></Route>
              <Route path="/mapInfo" element={<MapInfo />} /> {/*임시*/}
              <Route path="/tour" element={<ContentMain />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
