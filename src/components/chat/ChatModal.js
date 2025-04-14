import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { Modal, Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PostAddIcon from "@mui/icons-material/PostAdd";
import ChatList from "./ChatList";
import ChatContent from "./ChatContent";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import { createChatMsg, DropdownItem } from "../utils/metaSet";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ChatMenu from "./ChatMenu";

const ChatModal = ({
  chatModalEl,
  setChatModalEl,
  chatMenu,
  setChatMenu,
  setIsNewMessage,
}) => {
  const loginNickname = useRecoilValue(loginNicknameState);
  const close = (e) => {
    e.stopPropagation();
    setSelectedRoom(null);
    setChatModalEl(null);
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
  useEffect(() => {
    if (!Array.isArray(roomList)) return;
    // 안읽은 메시지 있는 채팅방만 필터
    const unreadRooms = roomList.filter(
      (room) => room.notRead > 0 && room.groupInfo.length > 1
    );
    // DropdownItem 리스트로 변환
    const menuItems = unreadRooms.map((room, i) => {
      return new DropdownItem(
        <AnnouncementIcon />,
        `${room.chatTitle}에 새 메시지!`,
        //클릭시 동작 함수
        (e) => {
          setChatModalEl(e.currentTarget);
          setSelectedRoom(room);
          menuItems.splice(i, 1);
          setChatMenu([...chatMenu, menuItems]);
        }
      );
    });
    setChatMenu([
      new DropdownItem(<MeetingRoomIcon />, "채팅방 입장", (e) => {
        setChatModalEl(e.currentTarget);
      }),
      ...menuItems,
    ]);
  }, [roomList]);
  const startChat = () => {
    const data = createChatMsg("FETCH_ROOM_LIST");
    ws.send(data);
  };
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    //data 타입별로 정리
    const data = JSON.parse(receiveData.data);
    switch (data.type) {
      case "ROOM_LIST":
        setRoomList(data.room);
        if (selectedRoom) {
          const sameRoom = data.room.find(
            (r) => r.chatNo === selectedRoom.chatNo
          );
          if (sameRoom) {
            setSelectedRoom(sameRoom);
          }
        }
        break;
      case "CHAT_CONTENT":
        // 1. 메시지가 없을 때는 초기화
        if (!Array.isArray(data.content) || data.content.length === 0) {
          setSelectedRoom(null); // 선택 해제 or 유지
          setContent([]); // 메시지 비우기
          break;
        }
        // 2. 메시지가 있다면 chatNo로 방 찾기
        const chatNo = data.content[0].chatNo;
        if (selectedRoom && selectedRoom.chatNo === chatNo) {
          setContent(data.content);
        }
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
        open={Boolean(chatModalEl)}
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
            width: "70%",
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
                ws={ws}
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
              <div
                style={{
                  backgroundImage: "url(/image/chat_back.png)",
                }}
                className="chat-intro"
              >
                <h1> Nadri 채팅</h1>
                <h2> 채팅 이용 방법</h2>
                <div className="intro-description">
                  <p>1. 채팅 목록 왼쪽 버튼을 이용해 채팅방을 만드세요.</p>
                  <p>2. 채팅 방 내에서 초대할 친구의 닉네임을 입력하세요.</p>
                  <p>
                    3. 채팅 방 제목은 채팅방 내 모두와 공유합니다. 변경 시
                    주의하세요.
                  </p>
                </div>
                <h2> 채팅 관련 준수사항</h2>
                <div className="intro-description">
                  <p>1. 혐오발언 및 기타 분쟁을 일으킬 대화는 삼가주세요.</p>
                  <p>
                    2. 타인에게 피해를 주는 행동은 불이익이 발생할 수 있습니다.
                  </p>
                  <p>3. 채팅 관련 문의 사항은 관리자에게 문의해 주세요.</p>
                </div>
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
