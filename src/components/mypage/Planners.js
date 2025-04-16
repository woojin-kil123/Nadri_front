import { useEffect, useState } from "react";
import "./management.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
import { useNavigate } from "react-router-dom";
import { loginNicknameState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import PlannerCard from "../utils/PlannerCard";
import ToggleBookmark from "../planner/utils/ToggleBookmark";

const Planner = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [planner, setPlanner] = useState([]);
  const [cards, setCards] = useState(null);
  const [message, setMessage] = useState("");

  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const changeContent = (value) => {
    setContent(value);
  };
  useEffect(() => {
    // 카테고리별로 다른 빈 메시지 설정
    let message = "";
    switch (content) {
      case "1":
        message = "다가오는 플래너가 없습니다.";
        break;
      case "2":
        message = "지나간 플래너가 없습니다.";
        break;
      case "3":
        message = "즐겨찾기한 플래너가 없습니다.";
        break;
      default:
        message = "";
    }
    setMessage(message);
    if (content === "1" || content === "2") {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/mypage/planner?nickname=${memberNickname}&value=${content}`
        )
        .then((res) => {
          setPlanner(res.data.list);
        })
        .catch((err) => {});
    } else if (content === "3") {
      axios
        .get(
          `${
            process.env.REACT_APP_BACK_SERVER
          }/plan?reqPage=${1}&order=${1}&loginNickname=${memberNickname}&isBookmark=true`
        )
        .then((res) => {
          setCards(res.data);
        });
    }
  }, [content]);

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
              즐겨찾기 한 플래너
            </li>
          </ul>
        </nav>
      </div>
      <div className="contnent-manage-list">
        <div>
          {((!planner || planner.length === 0) && content !== "3") ||
          ((!cards || cards.length === 0) && content === "3") ? (
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
          ) : content !== "3" ? (
            <ul className="posting-wrap">
              {planner.map((card, index) => (
                <PlannerCard
                  key={"planner-" + index}
                  planner={card}
                  cards={planner}
                  setCards={setPlanner}
                />
              ))}
            </ul>
          ) : (
            <ul className="posting-wrap">
              {cards.map((card, index) => (
                <PlanCard
                  key={"planCard-" + index}
                  plan={card}
                  cards={cards}
                  setCards={setCards}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

const PlanCard = ({ plan, cards, setCards }) => {
  const navigate = useNavigate();
  const setBookmarked = () => {
    const data = cards.filter((item) => {
      return item !== plan;
    });

    setCards(data);
  };

  const calculateDDay = (startDate, endDate) => {
    const today = new Date(); // 현재 날짜
    today.setHours(0, 0, 0, 0); // 시간은 0으로 초기화하여 날짜만 비교하도록 함
    const start = new Date(startDate); // startDate를 Date 객체로 변환
    const end = new Date(endDate); // endDate를 Date 객체로 변환

    // startDate가 오늘보다 이전인 경우 (지나간 일정은 D+xx로 표시)
    if (today > start) {
      const timeDiff = today - start; // 밀리초 차이 계산
      return `day+${Math.ceil(timeDiff / (1000 * 3600 * 24))}`; // 밀리초를 일수로 변환
    }

    // 다가오는 일정: startDate가 오늘 이후일 경우 D-xx
    if (today < start) {
      const timeDiff = start - today; // 밀리초 차이 계산
      return `day-${Math.ceil(timeDiff / (1000 * 3600 * 24))}`; // 밀리초를 일수로 변환
    }

    // 진행 중인 일정: startDate가 오늘과 같을 경우 D-0
    if (today === start) {
      return "day-0"; // 시작일이 오늘인 경우
    }
  };

  const dDay = plan ? calculateDDay(plan.startDate, plan.endDate) : null;

  return (
    <>
      {!plan ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card3"
          onClick={() => {
            navigate(`/planner/${plan.planNo}`);
          }}
        >
          <div className="image-container">
            <img
              src={
                plan.placeThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/assets/plan/thumb/${plan.planThumb}`
                  : "/image/default_thumb.png"
              }
              className="card3-image"
            />
            <ToggleBookmark
              bookmarked={plan.bookmarked}
              setBookmarked={setBookmarked}
              objectNo={plan.planNo}
              controllerUrl={"/plan"}
            />
          </div>
          <div className="card3-content">
            <h3 className="planner-title">{plan.planName}</h3>
          </div>
          <div className="card3-date">
            <span className="planner-date">{plan.startDate}</span>
            <span> ~ </span>
            <span className="planner-date">{plan.endDate}</span>
            <span className="d-day">{dDay}</span> {/* d-xx, +xx, d-0 */}
          </div>
        </div>
      )}
    </>
  );
};

export default Planner;
