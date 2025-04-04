import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "./calendar.css";
import { Modal } from "@mui/material";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
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
  const [holidays, setHolidays] = useState({
    ...holiday,
    // 여기에 사용자 등록 이벤트도 포함
  });

  const handleDateClick = () => {
    setModalOpen(true);
  };

  const handleEventClick = () => {
    setModalOpen(true);
  };
  const handleEventDrop = () => {};

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={koLocale}
        selectable={true}
        editable={true}
        customButtons={{
          insert: {
            text: "일정 추가",
            click: () => {},
          },
        }}
        headerToolbar={{
          left: "insert",
          right: "prev,next",
        }}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        dayCellContent={(arg) => {
          const dateStr = arg.date.toISOString().slice(0, 10);
          const isHoliday = holidays[dateStr];
          const dayNum = arg.date.getDate();

          return (
            <div className="calendar-cell-content">
              <div className={isHoliday ? "holiday-number" : "day-number"}>
                {dayNum}
              </div>
              {isHoliday && <div className="holiday-label">{isHoliday}</div>}
            </div>
          );
        }}
      />

      {modalOpen && <CalendarModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
const CalendarModal = ({ onClose, isEditing }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{isEditing ? "이벤트 수정" : "새 이벤트 등록"}</h3>
        <input type="text" placeholder="이벤트 제목" />
        <div className="modal-buttons">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};
