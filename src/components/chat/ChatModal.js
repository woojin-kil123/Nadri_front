import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import { ChatMsg, createChatMsg } from "../utils/metaSet";

const ChatModal = ({ anchorEl, setAnchorEl }) => {
  //const userNick = useRecoilValue(loginNickState);
  //const memberNickname = useRecoilValue(loginNicknameState);
  //테스트용
  const memberNickname = "길우진";
  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const [ws, setWs] = useState({});
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [content, setContent] = useState([]);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");
  useEffect(() => {
    const socket = new WebSocket(
      `${socketServer}/chat?memberNickname=${memberNickname}`
    );
    setWs(socket);
    return () => {
      console.log("채팅페이지에서 벗어나면 실행");
      socket.close();
    };
  }, []);

  const startChat = () => {
    console.log("웹소켓 연결 시 실행되는 함수");
    const data = createChatMsg("FETCH_ROOM_LIST");
    ws.send(data);
  };
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    //data 타입별로 정리
    const data = JSON.parse(receiveData.data);
    console.log(data);
    switch (data.type) {
      case "ROOM_LIST":
        setRoomList(data.room);
        break;
      case "CHAT_CONTENT":
        const room = roomList.filter((room, i) => {
          return data.content[0].chatNo == room.chatNo;
        });
        setSelectedRoom(room[0]);
        setContent(data.content);
        break;
    }
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
            <IconButton
              size="medium"
              className="primary-icon"
              sx={{
                padding: 1,
                boxSizing: "border-box",
              }}
              onClick={() => {
                //채팅방 만들기
                const msg = createChatMsg("CREATE_ROOM");
                ws.send(msg);
              }}
            >
              <PostAddIcon sx={{ width: 45, height: 45 }} />
            </IconButton>
          </div>
          <div className="content-middle">
            <ChatList
              roomList={roomList}
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
              <IconButton className="close-btn" onClick={close}>
                <CloseIcon />
              </IconButton>
              <ChatContent
                ws={ws}
                selectedRoom={selectedRoom}
                content={content}
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
