import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/member/Login";
import Join from "./components/member/Join";
import Join2 from "./components/member/Join2";
import UpdatePw from "./components/member/UpdatePw";
import UpdatePw2 from "./components/member/UpdatePw2";
import PlannerFrm from "./components/planner/PlannerFrm";
import ReviewMain from "./components/review/ReviewMain";
import MapInfo from "./components/utils/MapInfo";
import { useRecoilState } from "recoil";
import { isPlannerState } from "./components/utils/RecoilData";
import { useEffect } from "react";
import ContentMain from "./components/content/ContentMain";
import ReviewWrite from "./components/review/ReviewWrite";

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

  return (
    <>
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
              <Route path="/updatePw" element={<UpdatePw />} />
              <Route path="/updatePw2" element={<UpdatePw2 />} />
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
