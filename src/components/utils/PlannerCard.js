import { useNavigate } from "react-router-dom";
import "./plannerCard.css";
import ToggleBookmark from "../planner/utils/ToggleBookmark";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlannerCard(props) {
  const navigate = useNavigate();
  const planner = props.planner;

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

  const dDay = planner
    ? calculateDDay(planner.startDate, planner.endDate)
    : null;

  return (
    <>
      {!planner ? (
        <div>내용 없음</div>
      ) : (
        <div
          className="card3"
          onClick={() => {
            navigate(`/planner/${planner.planNo}`);
          }}
        >
          <div className="image-container">
            <img
              src={
                planner.placeThumb
                  ? `${process.env.REACT_APP_BACK_SERVER}/assets/plan/thumb/${planner.planThumb}`
                  : "/image/dora.png"
              }
              className="card3-image"
            />
          </div>
          <div className="card3-content">
            <h3 className="planner-title">{planner.planName}</h3>
          </div>
          <div className="card3-date">
            <span className="planner-date">{planner.startDate}</span>
            <span> ~ </span>
            <span className="planner-date">{planner.endDate}</span>
            <span className="d-day">{dDay}</span> {/* d-xx, +xx, d-0 */}
          </div>
        </div>
      )}
    </>
  );
}
