import { useEffect, useState } from "react";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { createChatMsg } from "../utils/metaSet";

const ChatList = ({ ws, roomList, selectedRoom, setSelectedRoom }) => {
  return (
    <>
      {roomList.map((room, i) => {
        return (
          <div
            key={`chatRoom-${i}`}
            onClick={() => {
              if (selectedRoom?.chatNo === room.chatNo) return;
              setSelectedRoom(room);
              const msg = createChatMsg("SELECT_ROOM", room.chatNo);
              ws.send(msg);
            }}
            className={
              selectedRoom?.chatNo === room.chatNo ? "selected-room" : ""
            }
          >
            <div className="room-title disabled-icon">
              {room.notRead > 0 && <span className="new-badge">NEW!</span>}
              <h4>{room.chatTitle}</h4>
            </div>
            <p>({room.groupInfo.length})</p>
          </div>
        );
      })}
    </>
  );
};
export default ChatList;
