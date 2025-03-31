import { useEffect, useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

const ChatList = ({ roomList, selectedRoom, setSelectedRoom }) => {
  return (
    <>
      {roomList.map((room, i) => {
        return (
          <div
            key={`chatRoom-${i}`}
            onClick={() => {
              setSelectedRoom(room);
            }}
            className={selectedRoom == room ? "selected-room" : ""}
          >
            <div className="room-title disabled-icon">
              {room.notRead > 0 && <span className="new-badge">NEW!</span>}
              <h4>{room.chatTitle}</h4>
            </div>
            <p>({room.groupSize})</p>
          </div>
        );
      })}
    </>
  );
};
export default ChatList;
