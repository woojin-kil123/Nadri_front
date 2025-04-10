import { getTodayDate } from "@mui/x-date-pickers/internals";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getKoreanToday } from "./metaSet";

const EventPopup = ({ onClose, dailyClose }) => {
  const today = getKoreanToday();
  const [event, setEvent] = useState();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/admin/event/onGoing?date=${today}`
      )
      .then((res) => {
        setEvent(res.data);
      });
  }, []);
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          X
        </button>
        {event &&
          event.map((e, i) => (
            <div
              key={"eventpop-" + i}
              className="event"
              style={{
                backgroundImage: `url("${
                  e.eventImg
                    ? `${process.env.REACT_APP_BACK_SERVER}/event/thumb/${e.eventImg}`
                    : "/image/dora.png"
                }")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h2>{e.eventTitle}</h2>
              <p>{e.eventContent}</p>
              <p>
                {e.startDate} ~ {e.endDate}
              </p>
            </div>
          ))}
        <button onClick={dailyClose}>오늘하루 보지않기</button>
      </div>
    </div>
  );
};

export default EventPopup;
