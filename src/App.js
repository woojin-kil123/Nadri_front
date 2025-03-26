import Footer from "./components/common/Footer";
import Header from "./components/common/Header";
import Main from "./components/common/Main";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Member/Login";
import Join from "./components/Member/Join";
import Join2 from "./components/Member/Join2";
import RePw from "./components/Member/RePw";
import RePw2 from "./components/Member/RePw2";

function App() {
  return (
    <div className="wrap">
      <Header />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/join2" element={<Join2 />} />
          <Route path="/rePw" element={<RePw />} />
          <Route path="/rePw2" element={<RePw2 />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
