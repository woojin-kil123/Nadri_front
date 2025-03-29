import TelegramIcon from "@mui/icons-material/Telegram";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { pink } from "@mui/material/colors";

const ChatContent = ({ ws, selectedRoom, content, setContent }) => {
  const loginNick = "길우진";
  const [msg, setMsg] = useState("");
  const chatNo = selectedRoom.chatNo;
  useEffect(() => {
    const selectMsg = {
      type: "select",
      chatNo: chatNo,
    };
    const data = JSON.stringify(selectMsg);
    ws.send(data);
  }, [selectedRoom]);

  const send = () => {
    if (!msg) {
      return;
    }
    const chatMsg = {
      type: "text",
      chatNo: chatNo,
      message: msg,
    };
    const data = JSON.stringify(chatMsg);
    ws.send(data);
  };
  return (
    <>
      <div className="content-top">
        <div className="chat-title-wrap warning-icon">
          <h2>{selectedRoom.chatTitle}</h2>
          <StarOutlineIcon sx={{ width: 35, height: 35, cursor: "pointer" }} />
        </div>
        <div className="content-btn-wrap">
          <IconButton className="primary-icon">
            <PersonAddIcon sx={{ width: 35, height: 35 }} />
          </IconButton>
          <IconButton className="danger-icon">
            <ExitToAppIcon sx={{ width: 35, height: 35 }} />
          </IconButton>
        </div>
      </div>
      <div className="content-middle">
        {content.map((c, i) => {
          return (
            <div
              key={`content-${i}`}
              className={
                loginNick == c.memberNickname
                  ? "chat-box right"
                  : "chat-box left"
              }
            >
              <h3>{c.memberNickname}</h3>
              <p className="chat-text">{c.chatContent}</p>
            </div>
          );
        })}
      </div>
      <div className="content-bottom">
        <input
          type="text"
          placeholder="메세지 입력"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <AddPhotoAlternateIcon>
          <input type="file"></input>
        </AddPhotoAlternateIcon>
        <button className="btn-primary" onClick={send}>
          보내기
          <TelegramIcon />
        </button>
      </div>
    </>
  );
};
export default ChatContent;
