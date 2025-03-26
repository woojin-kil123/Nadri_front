import React from "react";
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
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          borderBottom={1}
          pb={2}
        >
          <Typography id="chat-modal-title" variant="h6">
            {chatTitle}
          </Typography>
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 2 }}>
          자식컴포넌트
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          borderTop={1}
          pt={2}
          mt={2}
        >
          <Button variant="contained" color="success" onClick={close}>
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
export default ChatModal;
