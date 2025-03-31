import ChatIcon from "@mui/icons-material/Chat";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatModal from "./ChatModal";
import Dropdown from "../utils/Dropdown";
import { DropdownItem } from "../utils/metaSet";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const ChatMenu = ({ chatEl, setChatEl }) => {
  const [chatModalEl, setChatModalEl] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const chatOpen = (e) => {
    setChatEl(e.currentTarget);
  };
  const chatModalOpen = (e) => {
    setChatModalEl(e.currentTarget);
  };
  const chatMenu = [
    new DropdownItem(<MeetingRoomIcon />, "채팅방 입장", chatModalOpen),
  ];
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
        anchorEl={chatModalEl}
        setAnchorEl={setChatModalEl}
        sx={{ zIndex: 50 }}
      />
      <IconButton
        onClick={chatOpen}
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
        <ChatIcon sx={{ width: 50, height: 50 }} />
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
