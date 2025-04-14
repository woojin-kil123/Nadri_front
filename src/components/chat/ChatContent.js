import TelegramIcon from "@mui/icons-material/Telegram";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useEffect, useRef, useState } from "react";
import { IconButton, InputBase, Paper } from "@mui/material";
import { createChatMsg, DropdownItem } from "../utils/metaSet";
import { useRecoilValue } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dropdown from "../utils/Dropdown";
import GroupIcon from "@mui/icons-material/Group";
import axios from "axios";

const ChatContent = ({
  ws,
  selectedRoom,
  setSelectedRoom,
  content,
  setSystemModal,
  setIsSystemModal,
}) => {
  const loginNickname = useRecoilValue(loginNicknameState);
  const [title, setTitle] = useState("");
  const [moreEl, setMoreEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const titleInput = useRef(null);
  const [hoverGroupMenu, setHoverGroupMenu] = useState(false);
  console.log(selectedRoom);
  useEffect(() => {
    if (editMode && titleInput.current) {
      titleInput.current.focus();
    } else {
      titleInput.current?.blur();
    }
  }, [editMode]);
  const updateTitle = () => {
    if (editMode) {
      if (title != "") {
        const msg = createChatMsg("UPDATE_TITLE", chatNo, title);
        ws.send(msg);
      }
    }
    setEditMode((prev) => !prev);
  };
  const checkExit = () => {
    setIsSystemModal(true);
    setSystemModal({
      title: "📢 시스템 메시지",
      text: "채팅방을 나가시겠습니까?",
      buttons: [
        {
          text: "확인",
          onClick: () => {
            const msg = createChatMsg("LEAVE_ROOM", chatNo);
            ws.send(msg);
            setIsSystemModal(false);
            setSelectedRoom(null);
          },
        },
        {
          text: "닫기",
          onClick: () => setIsSystemModal(false),
        },
      ],
    });
  };
  const moreMenu = [
    new DropdownItem(
      (
        <div
          className="dropdown-group-wrapper"
          onMouseEnter={() => setHoverGroupMenu(true)}
          onMouseLeave={() => setHoverGroupMenu(false)}
        >
          <div className="group-menu-item">
            <GroupIcon style={{ marginLeft: "4px", color: "#333" }} />
            <span style={{ marginLeft: "8px" }}>참여중 목록</span>
          </div>

          {hoverGroupMenu && (
            <div className="groupInfo-popup">
              {selectedRoom.groupInfo.map((item, i) => (
                <div key={`group-user-${i}`} className="groupInfo">
                  <img
                    src={
                      item.profileImg
                        ? `${process.env.REACT_APP_BACK_SERVER}/profile/${item.profileImg}`
                        : "/image/default_user.png"
                    }
                    alt="profile"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>{item.memberNickname}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
      "", // 라벨 없음 (커스텀 렌더링)
      null
    ),
    new DropdownItem(
      (
        <DriveFileRenameOutlineIcon
          sx={{ width: 30, height: 30, marginLeft: "4px", color: "#333" }}
        />
      ),
      "방 제목 변경",
      updateTitle
    ),
    new DropdownItem(
      <ExitToAppIcon sx={{ width: 35, height: 35, fill: "#dc143c" }} />,
      "채팅방 나가기",
      checkExit
    ),
  ];
  const moreOpen = (e) => {
    setMoreEl(e.currentTarget);
  };

  const [msg, setMsg] = useState("");
  const chatNo = selectedRoom.chatNo;
  const previousChatNoRef = useRef(null);
  useEffect(() => {
    if (!selectedRoom) return;
    // chatNo 중복 방지
    if (selectedRoom.chatNo === previousChatNoRef.current) return;
    const data = createChatMsg("SELECT_ROOM", chatNo);
    ws.send(data);
    setTitle(selectedRoom.chatTitle);
    previousChatNoRef.current = selectedRoom.chatNo;
  }, [selectedRoom]);
  const chatDiv = useRef(null);
  //스크롤 위치 맞추는 함수
  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrollTop = chatDiv.current.scrollHeight;
    }
  }, [content]);
  const send = () => {
    if (!msg) {
      return;
    }
    const data = createChatMsg("SEND_MESSAGE", chatNo, msg);
    ws.send(data);
    setMsg("");
  };

  return (
    <>
      <div className="content-top">
        <div className="chat-title-wrap">
          <IconButton
            onClick={moreOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={moreEl ? "more-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={moreEl ? "true" : undefined}
          >
            <MoreVertIcon />
            <Dropdown
              id={"more-menu"}
              menus={moreMenu}
              anchorEl={moreEl}
              setAnchorEl={setMoreEl}
            ></Dropdown>
          </IconButton>
          <label
            htmlFor="chat-title"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            className="chat-title-label"
            onMouseDown={(e) => {
              if (!editMode) e.preventDefault();
            }}
          >
            <input
              id="chat-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              size={Math.max(title.length, 1)}
              readOnly={!editMode}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  updateTitle();
                }
              }}
              ref={titleInput}
            />
          </label>
        </div>
        <div className="chat-search-wrap">
          <CustomizedInputBase ws={ws} chatNo={chatNo} />
        </div>
      </div>
      <div className="content-middle" ref={chatDiv}>
        {content.map((c, i) => {
          return (
            <div
              key={`content-${i}`}
              className={
                c.memberNickname == "길우진"
                  ? "admin-msg"
                  : c.memberNickname == loginNickname
                  ? "right"
                  : "left"
              }
            >
              {c.memberNickname != "길우진" && <h3>{c.memberNickname}</h3>}
              <p
                className={
                  c.memberNickname == "길우진" ? "admin-text" : "chat-text"
                }
              >
                {c.chatContent}
              </p>
            </div>
          );
        })}
      </div>
      <div className="content-bottom">
        <input
          type="text"
          placeholder="메세지 입력"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
        />
        <AddPhotoAlternateIcon>
          <input type="file"></input>
        </AddPhotoAlternateIcon>
        <button className="btn-primary" onClick={send}>
          보내기
          <TelegramIcon />
        </button>
      </div>
    </>
  );
};

// 검색 창
const CustomizedInputBase = ({ ws, chatNo }) => {
  const [inputName, setInputName] = useState("");
  const invite = () => {
    if (inputName != "") {
      const msg = createChatMsg("INVITE_ROOM", chatNo, inputName);
      ws.send(msg);
    }
  };
  return (
    <Paper
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 40,
        width: 250,
        padding: 0.3,
      }}
    >
      <InputBase
        aria-label="search"
        sx={{ ml: 1, fontSize: "12px", width: 200 }}
        placeholder="초대할 닉네임을 입력하세요"
        value={inputName}
        onChange={(e) => {
          setInputName(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            invite();
          }
        }}
      />
      <IconButton
        sx={{ mr: 2, padding: 0 }}
        aria-label="search"
        onClick={invite}
      >
        <PersonAddIcon sx={{ width: 30, height: 30, fill: "#30c272" }} />
      </IconButton>
    </Paper>
  );
};

export default ChatContent;
