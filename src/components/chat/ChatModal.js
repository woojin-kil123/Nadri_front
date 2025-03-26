import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilValue } from "recoil";
import { loginNoState } from "../utils/RecoilData";
import SendIcon from "@mui/icons-material/Send";

const ChatModal = ({ anchorEl, setAnchorEl, chatTitle }) => {
  //const userNick = useRecoilValue(loginNickState);
  const memberNick = "길우진";
  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const [ws, setWs] = useState({});
  const [chatMsg, setChatMsg] = useState({
    type: "enter",
    memberNick: memberNick,
    message: "",
  });
  const backServer = process.env.REACT_APP_BACK_SERVER;
  // 웹소켓 요청  형식 WS://192.168.10.20:8888
  const socketServer = backServer.replace("http://", "ws://");
  useEffect(() => {
    const socket = new WebSocket(`${socketServer}/chatList`);
    setWs(socket);
    //mount 될 때 useEffect함수가 실행됨.
    //return 함수는 컴포넌트가 언마운트될 때 동작해야할 코드를 작성하는 영역 -> 해당 페이지를 벗어날때 초기화해야하는게 있으면 여기서
    return () => {
      console.log("채팅페이지에서 벗어나면 실행");
      //ws.close()는 setWs(socket)이 아직 동작하지 않았으므로 에러발생
      //socket.close()함수가돌아가면 endChat 함수가 동작
      socket.close();
    };
  }, []);

  return (
    <Modal
      open={Boolean(anchorEl)}
      onClose={close}
      aria-labelledby="chat-modal-title"
      sx={{ display: "flex" }}
    >
      <Box
        className="chat-modal"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 1200,
          height: 800,
          bgcolor: "transparent",
          p: 4,
          borderRadius: 2,
          display: "flex",
          gap: "20px",
        }}
      >
        <div className="chat-list">
          <div className="content-top">
            <h2>채팅목록</h2>
          </div>
          <div className="content-middle">
            <p>방1</p>
            <p>방2</p>
            <p>방3</p>
          </div>
          <div className="content-bottom"></div>
        </div>
        <div></div>
        <div className="chat-content">
          <div className="content-top">
            <h2>채팅내용</h2>
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          </div>
          <div className="content-middle"></div>
          <div className="content-bottom">
            <input placeholder="텍스트 입력" />
            <button className="btn-primary">
              보내기
              <SendIcon />
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default ChatModal;
