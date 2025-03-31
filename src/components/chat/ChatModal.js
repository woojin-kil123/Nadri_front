import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { Modal, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import { createChatMsg } from "../utils/metaSet";

const ChatModal = ({ anchorEl, setAnchorEl }) => {
  const loginNickname = useRecoilValue(loginNicknameState);
  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const [isSystemModal, setIsSystemModal] = useState(false);
  const [systemModal, setSystemModal] = useState(null);
  const [ws, setWs] = useState({});
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [content, setContent] = useState([]);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");
  useEffect(() => {
    const socket = new WebSocket(
      `${socketServer}/chat?memberNickname=${loginNickname}`
    );
    setWs(socket);
    return () => {
      console.log("채팅페이지에서 벗어나면 실행");
      socket.close();
    };
  }, []);

  const startChat = () => {
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
      case "ERROR":
        setIsSystemModal(true);
        setSystemModal({
          title: "📢 시스템 메시지",
          text: "오류발생!!",
          buttons: [
            {
              text: "닫기",
              color: "error",
              onClick: () => setIsSystemModal(false),
            },
          ],
        });
        break;
      case "NOT_EXIST":
        setIsSystemModal(true);
        setSystemModal({
          title: "📢 시스템 메시지",
          text: "일치하는 회원이 없습니다.",
          buttons: [
            {
              text: "확인",
              onClick: () => setIsSystemModal(false),
            },
          ],
        });
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
    <>
      {systemModal && (
        <SystemModal
          open={isSystemModal}
          onClose={() => {
            setIsSystemModal(false);
          }}
          systemModal={systemModal}
        />
      )}
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
            width: "80%",
            height: "80%",
            minWidth: 800,
            minHeight: 500,
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
                  setSelectedRoom={setSelectedRoom}
                  content={content}
                  setSystemModal={setSystemModal}
                  setIsSystemModal={setIsSystemModal}
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
    </>
  );
};
const SystemModal = ({ open, onClose, systemModal }) => {
  const { title, text, buttons = [] } = systemModal;

  return (
    <Modal open={open} onClose={onClose} disableEscapeKeyDown={false}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          zIndex: 1500,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "1rem",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            marginBottom: "1.5rem",
            color: "#333",
            whiteSpace: "pre-line",
          }}
        >
          {text}
        </p>

        <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              variant={btn.variant || "contained"}
              onClick={btn.onClick}
            >
              {btn.text}
            </Button>
          ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default ChatModal;
