import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import ChatList from "./ChatList";
import ChatContent from "./ChatContent";

const ChatModal = ({ anchorEl, setAnchorEl, chatTitle }) => {
  //const userNick = useRecoilValue(loginNickState);
  const memberNickname = "길우진";
  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const [ws, setWs] = useState({});
  const [chatRoom, setChatRoom] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [content, setContent] = useState([]);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");
  useEffect(() => {
    const socket = new WebSocket(
      `${socketServer}/chat?memberNickname=${memberNickname}`
    );
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
  const startChat = () => {
    console.log("웹소켓 연결 시 실행되는 함수");
  };
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data);
    console.log(data.room);
    console.log(data.content);
    data.room && setChatRoom(data.room);
    data.content && setContent(data.content);
  };
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;
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
            <ChatList
              chatRoom={chatRoom}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
          </div>
          <div className="content-bottom"></div>
        </div>
        <div></div>
        <div className="chat-room">
          {selectedRoom ? (
            <>
              <div className="content-top">
                <h2>{selectedRoom.chatTitle}</h2>
                <IconButton onClick={close}>
                  <CloseIcon />
                </IconButton>
              </div>
              <ChatContent
                ws={ws}
                selectedRoom={selectedRoom}
                content={content}
                setContent={setContent}
              />
            </>
          ) : (
            <div>
              <h1>깨끗한 채팅 부탁드립니다.</h1>
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};
export default ChatModal;
