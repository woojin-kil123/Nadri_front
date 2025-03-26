import React from "react";
import "./chat.css";
import { Modal, Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRecoilValue } from "recoil";
import { loginNoState } from "../utils/RecoilData";

const ChatModal = ({ anchorEl, setAnchorEl, chatTitle }) => {
  //const userNo = useRecoilValue(loginNoState);
  const userNo = 1;
  const close = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

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
          <div className="content-middle"></div>
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
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default ChatModal;
