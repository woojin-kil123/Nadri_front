import ChatIcon from "@mui/icons-material/Chat";
import { Box, IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatModal from "./ChatModal";
import Dropdown from "../utils/Dropdown";
import { DropdownItem } from "../utils/metaSet";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

const ChatMenu = ({ chatEl, setChatEl }) => {
  const [chatModalEl, setChatModalEl] = useState(null);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const chatModalOpen = (e) => {
    setChatModalEl(e.currentTarget);
  };
  const [chatMenu, setChatMenu] = useState([
    new DropdownItem(<MeetingRoomIcon />, "채팅방 입장", chatModalOpen),
  ]);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  useEffect(() => {
    if (chatMenu.length > 1) {
      setIsNewMessage(true);
      console.log("뉴메시지 유즈이펙트 작동");
    }
  }, [chatMenu.length]);
  const chatOpen = (e) => {
    setChatEl(e.currentTarget);
    setIsNewMessage(false);
  };

  useEffect(() => {
    const footer = document.querySelector(".footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <ChatModal
        chatModalEl={chatModalEl}
        setChatModalEl={setChatModalEl}
        setChatMenu={setChatMenu}
        setIsNewMessage={setIsNewMessage}
        sx={{ zIndex: 50 }}
      />
      <IconButton
        onClick={chatOpen}
        aria-label="open"
        size="small"
        className="primary-icon"
        sx={{
          position: "fixed",
          bottom: isFooterVisible ? "350px" : "5%",
          right: "5%",
          zIndex: 200,
          padding: 2,
          boxSizing: "border-box",
          transition: "bottom 0.3s ease-in-out",
        }}
      >
        {isNewMessage && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "red",
              boxShadow: "0 0 0 2px white", // 흰 테두리로 눈에 띄게
            }}
          />
        )}
        <ChatIcon sx={{ width: 50, height: 50 }} title="open" />

        <Dropdown
          direction="top"
          anchorEl={chatEl}
          setAnchorEl={setChatEl}
          menus={chatMenu}
          id="alarm-menu"
          className="alarm"
        />
      </IconButton>
    </>
  );
};

export default ChatMenu;
