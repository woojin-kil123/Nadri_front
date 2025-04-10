import { useNavigate } from "react-router-dom";
import "./plannerCard.css";

export default function PlannerCard(props) {
  const navigate = useNavigate();
  const planner = props.planner;
  return (
    <>
      {!planner ? (
        <div>내용 없음</div>
      ) : (
        <div className="card3">
          <div className="image-container">
            <img
              src={planner.placeThumb ? planner.planThumb : "/image/dora.png"}
              className="card3-image"
            />
          </div>
          <div className="card3-content">
            <h3 className="title">{planner.planName}</h3>
          </div>
          <div className="card3-date">
            <span className="title">{planner.startDate}</span>
            <span>~</span>
            <span className="title">{planner.endDate}</span>
          </div>
        </div>
      )}
    </>
  );
}
