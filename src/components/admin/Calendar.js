import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "./calendar.css";
import axios from "axios";
import Swal from "sweetalert2";
import { getKoreanToday } from "../utils/metaSet";
import UpdateModal from "./UpdateModal";

export default function Calendar({ placeType, setIsUpdate, isUpdate }) {
  const today = getKoreanToday();
  const [events, setEvents] = useState([]);
  const [updateEvent, setUpdateEvent] = useState({});
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [month, setMonth] = useState(today.slice(0, 7));
  const [tooltipEvent, setTooltipEvent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipTimeoutRef = useRef(null);

  const holiday = {
    "2025-01-01": "신정",
    "2025-03-01": "삼일절",
    "2025-05-05": "어린이날",
    "2025-06-06": "현충일",
    "2025-08-15": "광복절",
    "2025-10-03": "개천절",
    "2025-10-09": "한글날",
    "2025-12-25": "성탄절",
  };
  const [holidays, setHolidays] = useState({ ...holiday });

  const addOneDay = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/event/${month}`)
      .then((res) => {
        const mappedEvents = res.data.map((event, i) => ({
          start: event.startDate,
          end: addOneDay(event.endDate),
          allDay: true,
          classNames: [`event-type-${(i % 5) + 1}`],
          extendedProps: {
            ...res.data[i],
          },
        }));
        setEvents(mappedEvents);
      });
  }, [month, isUpdate]);

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        height="auto"
        contentHeight="auto"
        dayMaxEventRows={false}
        timeZone="Asia/Seoul"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        datesSet={(arg) => {
          const start = arg.view.currentStart;
          setMonth(
            `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(
              2,
              "0"
            )}`
          );
        }}
        customButtons={{
          insert: {
            text: "일정 추가",
            click: () => setInsertOpen(true),
          },
        }}
        headerToolbar={{ left: "insert", center: "title", right: "prev,next" }}
        eventContent={() => ({ html: "" })}
        events={events}
        eventClick={(info) => {
          setUpdateEvent(info.event);
          setUpdateOpen(true);
        }}
        eventDidMount={(info) => {
          info.el.setAttribute("data-title", info.event.title);
        }}
        eventMouseEnter={(info) => {
          // 1. 기존 타이머 클리어
          if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
          }

          // 2. 위치와 이벤트 설정
          const rect = info.el.getBoundingClientRect();
          setTooltipPosition({
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setTooltipEvent(info.event);
        }}
        eventMouseLeave={() => {
          // 3. 툴팁 닫기를 딜레이
          tooltipTimeoutRef.current = setTimeout(() => {
            setTooltipEvent(null);
          }, 300);
        }}
        dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().slice(0, 10);
          const isHoliday = holidays[dateStr];
          return (
            <div className="calendar-cell-content">
              <div className={isHoliday ? "holiday-number" : "day-number"}>
                {arg.date.getDate()}
              </div>
              {isHoliday && <div className="holiday-label">{isHoliday}</div>}
            </div>
          );
        }}
      />
      {tooltipEvent && (
        <EventTooltip
          event={tooltipEvent}
          position={tooltipPosition}
          onMouseLeave={() => setTooltipEvent(null)}
        />
      )}
      {insertOpen && (
        <UpdateModal
          onClose={() => setInsertOpen(false)}
          placeType={placeType}
          setIsUpdate={setIsUpdate}
        />
      )}
      {updateOpen && (
        <UpdateModal
          onClose={() => setUpdateOpen(false)}
          placeType={placeType}
          setIsUpdate={setIsUpdate}
          event={updateEvent}
        />
      )}
    </div>
  );
}

const EventTooltip = ({ event, position, onMouseLeave }) => {
  if (!event) return null;

  const data = event.extendedProps;
  const eventImg = data.eventImg;
  return (
    <div
      className="tooltip-card"
      style={{ top: position.top + 30, left: position.left + 20 }}
      onMouseLeave={onMouseLeave}
    >
      <img
        src={
          eventImg
            ? `${process.env.REACT_APP_BACK_SERVER}/event/thumb/${eventImg}`
            : "/image/default_img.png"
        }
      />
      <div className="tooltip-title">{data.eventTitle}</div>
      <div className="tooltip-sub">
        {event.startStr} ~ {event.endStr}
      </div>
    </div>
  );
};
