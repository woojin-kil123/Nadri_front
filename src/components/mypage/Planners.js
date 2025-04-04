import { useEffect, useState } from "react";
import "./management.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
import { useNavigate } from "react-router-dom";

const Planner = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [planner, setPlanner] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [message, setMessage] = useState("");
  const [pi, setPi] = useState([]);
  const changeContent = (value) => {
    setContent(value);

    // 카테고리별로 다른 빈 메시지 설정
    let message = "";
    switch (value) {
      case "comming-planner":
        message = "다가오는 플래너가 없습니다.";
        break;
      case "past-planner":
        message = "지나간 플래너가 없습니다.";
        break;
      case "bookmark-planner":
        message = "찜한 플래너가 없습니다.";
        break;
      default:
        message = "";
    }
    setMessage(message);

    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/review?reqPage=${reqPage}&value=${value}`
      )
      .then((res) => {
        console.log(res);
        //setPlanner(res.data.list);
        setPi(res.data.pi);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 페이지가 로드될 때 자동으로 "다가오는 플래너"로 설정
  useEffect(() => {
    changeContent("comming-planner");
  }, []);

  return (
    <section className="section">
      <div className="page-title">플래너 관리</div>
      <div className="manage-wrap">
        <nav className="manage-nav">
          <ul>
            <li
              className={content === "comming-planner" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("comming-planner");
              }}
            >
              다가오는 플래너
            </li>
            <li
              className={content === "past-planner" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("past-planner");
              }}
            >
              지나간 플래너
            </li>
            <li
              className={content === "bookmark-planner" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("bookmark-planner");
              }}
            >
              찜한 플래너
            </li>
          </ul>
        </nav>
      </div>
      <div className="contnent-manage-list">
        <div>
          {planner.length === 0 ? (
            <div className="empty-manage">
              <h3>{message}</h3>
              <p>지금 새로운 플래너를 만들어보세요.</p>
              <button
                className="manage-button"
                onClick={() => navigate("/planner")}
              >
                플래너 하기
              </button>
            </div>
          ) : (
            <ul className="posting-wrap">
              {planner.map((planner, index) => {
                return <h3>즐겨찾기 리스트</h3>;
              })}
            </ul>
          )}
        </div>
        <div className="manage-paging-wrap">
          <PageNavigation pi={pi} reqPage={reqPage} setReqPage={setReqPage} />
        </div>
      </div>
    </section>
  );
};

export default Planner;
