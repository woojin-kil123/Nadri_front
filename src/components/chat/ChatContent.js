import TelegramIcon from "@mui/icons-material/Telegram";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useEffect, useState } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { createChatMsg, DropdownItem } from "../utils/metaSet";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";

const ChatContent = ({
  ws,
  selectedRoom,
  setSelectedRoom,
  content,
  setSystemModal,
  setIsSystemModal,
}) => {
  const loginNickname = useRecoilValue(loginNicknameState);
  const [msg, setMsg] = useState("");
  const chatNo = selectedRoom.chatNo;
  useEffect(() => {
    if (selectedRoom) {
      const data = createChatMsg("SELECT_ROOM", chatNo);
      ws.send(data);
    }
  }, [selectedRoom]);
  const send = () => {
    if (!msg) {
      return;
    }
    const data = createChatMsg("SEND_MESSAGE", chatNo, msg);
    ws.send(data);
    setMsg("");
  };
  const checkExit = () => {
    setIsSystemModal(true);
    setSystemModal({
      title: "📢 시스템 메시지",
      text: "채팅방을 나가시겠습니까?",
      buttons: [
        {
          text: "확인",
          onClick: () => {
            const msg = createChatMsg("LEAVE_ROOM", chatNo);
            ws.send(msg);
            setIsSystemModal(false);
            setSelectedRoom(null);
          },
        },
        {
          text: "닫기",
          onClick: () => setIsSystemModal(false),
        },
      ],
    });
  };
  return (
    <>
      <div className="content-top">
        <div className="chat-title-wrap">
          <h2>{selectedRoom.chatTitle}</h2>
        </div>
        <div className="chat-search-wrap">
          <CustomizedInputBase ws={ws} chatNo={chatNo} />
          <IconButton sx={{ ml: 2, padding: 0 }} onClick={checkExit}>
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
                c.memberNickname == "길우진"
                  ? "admin-msg"
                  : c.memberNickname == loginNickname
                  ? "right"
                  : "left"
              }
            >
              {c.memberNickname != "길우진" && <h3>{c.memberNickname}</h3>}
              <p
                className={
                  c.memberNickname == "길우진" ? "admin-text" : "chat-text"
                }
              >
                {c.chatContent}
              </p>
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
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
const CustomizedInputBase = ({ ws, chatNo }) => {
  const [inputName, setInputName] = useState("");
  const invite = () => {
    if (inputName != "") {
      const msg = createChatMsg("INVITE_ROOM", chatNo, inputName);
      ws.send(msg);
    }
  };
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
        value={inputName}
        onChange={(e) => {
          setInputName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            invite();
          }
        }}
      />
      <IconButton
        sx={{ mr: 2, padding: 0 }}
        aria-label="search"
        onClick={invite}
      >
        <PersonAddIcon sx={{ width: 30, height: 30, fill: "#30c272" }} />
      </IconButton>
    </Paper>
  );
};

export default ChatContent;
