import { Route, Routes } from "react-router-dom";
import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import PlannerFrm from "./components/planner/PlannerFrm";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/planner" element={<PlannerFrm />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
