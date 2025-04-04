import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "./calendar.css";
import axios from "axios";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [insertOpen, setInsertOpen] = useState(false);
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
            click: () => {
              setInsertOpen(true);
            },
          },
        }}
        headerToolbar={{
          left: "insert",
          right: "prev,next",
        }}
        events={events}
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
      {insertOpen && <InsertModal onClose={() => setInsertOpen(false)} />}
      {modalOpen && <CalendarModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
const CalendarModal = ({ modalInner, onClose, isEditing }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        {modalInner}
        <div className="modal-buttons">
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

const InsertModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    description: "",
    start: "",
    end: "",
    image: File,
  });
  const [thumb, setThumb] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const changeThumb = (e) => {
    const file = e.target.files[0];
    setThumb(file);
  };
  return (
    <div className="modal-form-wrapper">
      <div className="modal-form-content">
        <form
          className="modal-form-layout-column"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="modal-form-top">
            <div className="form-column image-side">
              <div className="image-upload">
                <label htmlFor="imageUpload" className="upload-text">
                  <div className="image-preview">
                    <img
                      src="/image/dora.png"
                      style={{ objectFit: "contain" }}
                    ></img>
                  </div>
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  name="image"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];

                    setFormData((prev) => ({ ...prev, image: file }));
                  }}
                />
              </div>
            </div>

            <div className="form-column input-side">
              <div className="form-grid">
                <label>
                  제목
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종류
                  <select
                    name="type"
                    value={formData.type || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">선택</option>
                    <option value="회의">회의</option>
                    <option value="일정">일정</option>
                    <option value="기념일">기념일</option>
                  </select>
                </label>
                <label className="full-width">
                  내용
                  <textarea
                    type="text"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  시작일
                  <input
                    type="date"
                    name="start"
                    value={formData.start || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종료일
                  <input
                    type="date"
                    name="end"
                    value={formData.end || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="modal-form-buttons center">
            <button type="submit">등록하기</button>
            <button type="button" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
