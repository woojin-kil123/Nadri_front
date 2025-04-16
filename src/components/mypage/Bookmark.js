import { useEffect, useState } from "react";
import "./management.css";
import axios from "axios";
import PageNavigation from "../utils/PageNavigtion";
import { useNavigate } from "react-router-dom";
import ListCard from "../utils/ListCard";
import { loginNicknameState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import MypageListCard from "../utils/MypageListCard";

const Bookmark = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [bookmark, setBookmark] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(0); // 0: 전체, 12:관광지, 14:즐길거리, 32:숙박, 39:음식점
  const [cards, setCards] = useState([]);
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);

  const changeContent = (value) => {
    setContent(value);

    // 카테고리별로 다른 빈 메시지 설정
    let message = "";
    switch (value) {
      case "room":
        message = "즐겨찾기 한 숙소가 없습니다.";
        break;
      case "spot":
        message = "즐겨찾기 한  관광지가 없습니다.";
        break;
      case "food":
        message = "즐겨찾기 한  음식가 없습니다.";
        break;
      case "todo":
        message = "즐겨찾기 한  즐길거리가 없습니다.";
        break;
      default:
        message = "";
    }
    setMessage(message);

    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/mypage/bookmark?nickname=${memberNickname}&value=${value}`
      )
      .then((res) => {
        setBookmark(res.data.list);
      })
      .catch((err) => {});
  };

  // 페이지가 로드될 때 자동으로 "다가오는 플래너"로 설정
  useEffect(() => {
    changeContent("spot");
  }, []);

  return (
    <section className="section">
      <div className="page-title">즐겨찾기</div>
      <div className="manage-wrap">
        <nav className="manage-nav">
          <ul>
            <li
              className={content === "spot" ? "active-link" : ""}
              style={{ width: "25%" }}
              onClick={() => {
                changeContent("spot");
              }}
            >
              관광지
            </li>
            <li
              className={content === "todo" ? "active-link" : ""}
              style={{ width: "25%" }}
              onClick={() => {
                changeContent("todo");
              }}
            >
              즐길거리
            </li>
            <li
              className={content === "room" ? "active-link" : ""}
              style={{ width: "25%" }}
              onClick={() => {
                changeContent("room");
              }}
            >
              숙박
            </li>
            <li
              className={content === "food" ? "active-link" : ""}
              style={{ width: "25%" }}
              onClick={() => {
                changeContent("food");
              }}
            >
              음식점
            </li>
          </ul>
        </nav>
      </div>
      <div className="contnent-manage-list">
        <div>
          {bookmark.length === 0 ? (
            <div className="empty-manage">
              <h3>{message}</h3>
              <p>지금 새로운 여행지를 즐겨찾기 해보세요.</p>
              <button
                className="manage-button"
                onClick={() => navigate("/place")}
              >
                즐겨찾기 하기
              </button>
            </div>
          ) : (
            <ul className="posting-wrap">
              {Array.isArray(cards) &&
                bookmark.map((card, i) => {
                  return (
                    <MypageListCard
                      key={"card-" + i}
                      place={card}
                      bookmark={bookmark}
                      setBookmark={setBookmark}
                    />
                  );
                })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Bookmark;
