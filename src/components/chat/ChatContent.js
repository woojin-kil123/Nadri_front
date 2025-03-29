import TelegramIcon from "@mui/icons-material/Telegram";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import GradeIcon from "@mui/icons-material/Grade";
import { useEffect, useState } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { DropdownItem } from "../utils/metaSet";

const ChatContent = ({ ws, selectedRoom, content }) => {
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
        <div className="chat-title-wrap">
          <GradeIcon sx={{ width: 30, height: 30, cursor: "pointer" }} />
          <h2>{selectedRoom.chatTitle}</h2>
        </div>
        <div className="chat-search-wrap">
          <CustomizedInputBase />
          <IconButton sx={{ ml: 2, padding: 0 }} onClick={() => {}}>
            <ExitToAppIcon sx={{ width: 35, height: 35, fill: "#dc143c" }} />
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

// 검색 창
const CustomizedInputBase = () => {
  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        width: 250,
        padding: 0.3,
      }}
    >
      <InputBase
        aria-label="search"
        sx={{ ml: 2, fontSize: "12px" }}
        placeholder="초대할 닉네임을 입력하세요"
      />
      <IconButton
        sx={{ mr: 2, padding: 0 }}
        aria-label="search"
        onClick={() => {
          console.log("hi");
        }}
      >
        <PersonAddIcon sx={{ width: 30, height: 30, fill: "#30c272" }} />
      </IconButton>
    </Paper>
  );
};

export default ChatContent;
