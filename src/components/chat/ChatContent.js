import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";

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
          placeholder="텍스트 입력"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button className="btn-primary" onClick={send}>
          보내기
          <SendIcon />
        </button>
      </div>
    </>
  );
};
export default ChatContent;
