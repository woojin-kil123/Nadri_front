import { useEffect, useState } from "react";
import "./management.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
import { useNavigate } from "react-router-dom";
import { loginNicknameState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import PlannerCard from "../utils/PlannerCard";

const Planner = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [planner, setPlanner] = useState([]);
  const [message, setMessage] = useState("");
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const changeContent = (value) => {
    setContent(value);

    // 카테고리별로 다른 빈 메시지 설정
    let message = "";
    switch (value) {
      case "1":
        message = "다가오는 플래너가 없습니다.";
        break;
      case "2":
        message = "지나간 플래너가 없습니다.";
        break;
      case "3":
        message = "찜한 플래너가 없습니다.";
        break;
      default:
        message = "";
    }
    setMessage(message);

    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/mypage/planner?nickname=${memberNickname}&value=${value}`
      )
      .then((res) => {
        console.log(res);
        setPlanner(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 페이지가 로드될 때 자동으로 "다가오는 플래너"로 설정
  useEffect(() => {
    changeContent("1");
  }, []);

  return (
    <section className="section">
      <div className="page-title">플래너 관리</div>
      <div className="manage-wrap">
        <nav className="manage-nav">
          <ul>
            <li
              className={content === "1" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("1");
              }}
            >
              다가오는 플래너
            </li>
            <li
              className={content === "2" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("2");
              }}
            >
              지나간 플래너
            </li>
            <li
              className={content === "3" ? "active-link" : ""}
              style={{ width: "33%" }}
              onClick={() => {
                changeContent("3");
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
              {planner.map((planner, index) => (
                <PlannerCard key={"planner-" + index} planner={planner} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Planner;
