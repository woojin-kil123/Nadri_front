import { useEffect, useState } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import { getKoreanToday } from "../utils/metaSet";
import dayjs from "dayjs";

const Event = () => {
  const today = getKoreanToday();
  const [placeType, setPlaceType] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_SERVER}/place/type`).then((res) => {
      setPlaceType(res.data);
    });
  }, []);
  const [onGoing, setOnGoing] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/event/onGoing?date=${today}`)
      .then((res) => {
        setOnGoing(res.data);
      });
  }, [isUpdate]);
  const [end, setEnd] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/event/end?date=${today}`)
      .then((res) => {
        setEnd(res.data);
      });
  }, [isUpdate]);
  return (
    <div className="event-page">
      <section className="ongoing-event">
        <h2>진행 중인 이벤트</h2>
        <EventSlide onGoing={onGoing} placeType={placeType} />
      </section>
      <section className="calendar-section">
        <h2>일정 관리</h2>
        <Calendar
          placeType={placeType}
          setIsUpdate={setIsUpdate}
          isUpdate={isUpdate}
        />
      </section>
      <section className="end-event">
        <h2>종료된 이벤트</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th>이벤트 제목</th>
              <th>이벤트 내용</th>
              <th>이벤트 종료일</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {end.map((event, i) => (
              <tr key={"end-" + i}>
                <td>{event.eventTitle}</td>
                <td style={{ width: "50%" }}>{event.eventContent}</td>
                <td>{event.endDate}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      const eventNo = event.eventNo;
                      axios
                        .delete(
                          `${process.env.REACT_APP_BACK_SERVER}/event/${eventNo}`
                        )
                        .then((res) => {
                          if (res.data > 0) {
                            setIsUpdate((prev) => !prev);
                          }
                        });
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};
export default Event;

const EventSlide = ({ onGoing, placeType }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isSlideMode = onGoing.length > 3;

  // 3개씩 슬라이드 묶음 만들기
  const slides = [];
  for (let i = 0; i < onGoing.length; i += 3) {
    slides.push(onGoing.slice(i, i + 3));
  }

  useEffect(() => {
    if (!isSlideMode) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length, isSlideMode]);

  if (onGoing.length === 0) return null;

  return (
    <div className="intro-wrap">
      <div className="event-list">
        {isSlideMode
          ? slides[activeSlide].map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-thumbnail">
                  <img
                    src={`${process.env.REACT_APP_BACK_SERVER}/event/thumb/${event.eventImg}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
                <div className="event-info">
                  <h3>{event.eventTitle}</h3>
                  <p>
                    {
                      placeType.find((type) => type.id === event.placeTypeId)
                        ?.name
                    }
                  </p>
                  <p>
                    {event.startDate} ~ {event.endDate}
                  </p>
                </div>
              </div>
            ))
          : onGoing.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-thumbnail">
                  <img
                    src={`${process.env.REACT_APP_BACK_SERVER}/event/thumb/${event.eventImg}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="event-info">
                  <h3>{event.eventTitle}</h3>
                  <p>
                    {
                      placeType.find((type) => type.id === event.placeTypeId)
                        ?.name
                    }
                  </p>
                  <p>
                    {event.startDate} ~ {event.endDate}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};
