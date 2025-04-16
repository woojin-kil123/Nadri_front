import { useState } from "react";

const PlannerGuideModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {open ? (
        <div className="planner-guide-modal">
          <img src="/image/planner_guide.png" onClick={handleClose} />
        </div>
      ) : (
        <div className="planner-close-btn guide-modal-btn" onClick={handleOpen}>
          <span>💡</span>
          <p>가이드</p>
        </div>
      )}
    </div>
  );
};

export default PlannerGuideModal;
