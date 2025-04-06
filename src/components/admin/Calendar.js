import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import "./calendar.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Warning } from "@mui/icons-material";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [placeType, setPlaceType] = useState([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_SERVER}/place/type`).then((res) => {
      setPlaceType(res.data);
    });
  }, []);
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
      {insertOpen && (
        <InsertModal
          onClose={() => setInsertOpen(false)}
          placeType={placeType}
        />
      )}
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

const InsertModal = ({ onClose, placeType }) => {
  const [formData, setFormData] = useState({
    eventTitle: "",
    placeTypeId: "",
    eventContent: "",
    startDate: "",
    endDate: "",
    eventImg: "",
  });
  const [thumb, setThumb] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const changeThumb = (file) => {
    if (file) {
      const thumbUrl = URL.createObjectURL(file);
      setThumb(thumbUrl);
    }
  };
  //언마운트시 자원반환
  useEffect(() => {
    return () => {
      if (thumb) {
        URL.revokeObjectURL(thumb);
      }
    };
  }, [thumb]);
  const onSave = () => {
    if (!thumb) {
      Swal.fire({
        icon: "warning",
        title: "이미지가 없습니다.",
        text: "이벤트 이미지를 확인해주세요",
        scrollbarPadding: false,
        willOpen: () => {
          // ✅ body 직접 초기화
          document.body.style.overflow = "unset";
          document.body.style.paddingRight = "0px";
        },
        didClose: () => {
          // ✅ alert 닫힐 때도 복원 (중요!)
          document.body.style.overflow = "unset";
          document.body.style.paddingRight = "0px";
        },
      });
      return;
    }
    console.log(formData);
    const form = new FormData();
    form.append("eventTitle", formData.eventTitle);
    form.append("placeTypeId", formData.placeTypeId);
    form.append("eventContent", formData.eventContent);
    form.append("startDate", formData.startDate);
    form.append("endDate", formData.endDate);
    form.append("img", formData.eventImg);
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/event`, form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        if (res.data > 0) {
          setFormData({
            eventTitle: "",
            placeTypeId: "",
            eventContent: "",
            startDate: "",
            endDate: "",
            eventImg: "",
          });
          onClose();
        }
      });
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
          <div className="form-column image-side">
            <label htmlFor="imageUpload" className="image-label">
              <div className="image-preview">
                <img
                  src={thumb ? thumb : "/image/default_img.png"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                ></img>
              </div>
            </label>
            <input
              type="file"
              id="imageUpload"
              name="image"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                changeThumb(file);
                setFormData((prev) => ({ ...prev, eventImg: file })); // 프로필 이미지 상태 업데이트
              }}
            />
          </div>
          <div className="modal-form-top">
            <div className="form-column input-side">
              <div className="form-grid">
                <label>
                  제목
                  <input
                    type="text"
                    name="eventTitle"
                    value={formData.eventTitle || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종류
                  <select name="placeTypeId" onChange={handleChange} required>
                    <option value="">선택</option>
                    {placeType.map((type, i) => (
                      <option key={"eventType" + i} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="full-width">
                  내용
                  <textarea
                    type="text"
                    name="eventContent"
                    value={formData.eventContent || ""}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  시작일
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate || ""}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  종료일
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate || ""}
                    onChange={handleChange}
                    min={formData.startDate}
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
