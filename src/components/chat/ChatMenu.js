import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { IconButton } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatModal from "./ChatModal";
import Dropdown from "../utils/Dropdown";
import { DropdownItem } from "../utils/metaSet";
import { green } from "@mui/material/colors";

const ChatMenu = ({ chatEl, setChatEl }) => {
  const [chatModalEl, setChatModalEl] = useState(null);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // 감지할 투명 sentinel 엘리먼트를 만들기 위한 ref

  const chatOpen = (e) => {
    setChatEl(e.currentTarget);
  };

  const chatModalOpen = (e) => {
    setChatModalEl(e.currentTarget);
  };

  const chatMenu = [
    new DropdownItem(
      <ChatBubbleOutlineIcon />,
      "3건의 새로운 메세지가 있습니다.",
      chatModalOpen
    ),
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
      <ChatModal anchorEl={chatModalEl} setAnchorEl={setChatModalEl} />
      <IconButton
        onClick={chatOpen}
        size="small"
        className="chat-btn"
        sx={{
          position: "fixed",
          bottom: isFooterVisible ? "350px" : "5%",
          right: "10%",
          zIndex: 100,
          padding: 0,
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
