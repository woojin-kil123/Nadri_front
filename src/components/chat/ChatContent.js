import SendIcon from "@mui/icons-material/Send";
import { useEffect } from "react";

const ChatContent = ({ ws, selectedRoom }) => {
  useEffect(() => {
    const chatNo = selectedRoom.chatNo;
  }, [selectedRoom]);
  return (
    <>
      <div className="content-middle">하이하이</div>
      <div className="content-bottom">
        <input placeholder="텍스트 입력" />
        <button className="btn-primary">
          보내기
          <SendIcon />
        </button>
      </div>
    </>
  );
};
export default ChatContent;
