import "./default.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Dropdown from "../utils/Dropdown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { DropdownItem } from "../utils/metaSet";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatModal from "../chat/ChatModal";

const Header = () => {
  const [loginId, setLoginId] = useState("");
  return (
    <header className="header">
      <div>
        <div className="logo">
          <Link to="/">NADRI</Link>
        </div>
        <MainNavi></MainNavi>
        <HeaderLink loginId={loginId} />
      </div>
    </header>
  );
};
export default Header;

const MainNavi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/planner">플래너</Link>
        </li>
        <li>
          <Link to="#">여행 정보</Link>
        </li>
        <li>
          <Link to="/review">리뷰</Link>
        </li>
        <li className="search">
          <CustomizedInputBase />
        </li>
      </ul>
    </nav>
  );
};
const HeaderLink = (props) => {
  const loginId = props.loginId;
  const navigate = useNavigate();
  const accountMenu = [
    new DropdownItem(<InfoIcon />, "내 정보", () => {
      navigate("/mypage");
    }),
    new DropdownItem(<CalendarTodayIcon />, "나의 일정", () => {
      navigate("/myplan");
    }),
  ];
  const alarmMenu = [
    new DropdownItem(<TagFacesIcon />, "안녕하세요", null),
    new DropdownItem(<TagFacesIcon />, "잘가요", null),
  ];
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

  const [accountEl, setAccountEl] = useState(null);
  const [alarmEl, setAlarmEl] = useState(null);
  const [chatEl, setChatEl] = useState(null);
  const [chatModalEl, setChatModalEl] = useState(null);

  const accountOpen = (e) => {
    setAccountEl(e.currentTarget);
  };
  const alarmOpen = (e) => {
    setAlarmEl(e.currentTarget);
  };
  const chatOpen = (e) => {
    setChatEl(e.currentTarget);
  };
  return (
    <ul className="user-menu">
      {loginId ? (
        <>
          <ChatModal anchorEl={chatModalEl} setAnchorEl={setChatModalEl} />
          <li>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <IconButton
                onClick={chatOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={chatEl ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={chatEl ? "true" : undefined}
              >
                <ChatIcon sx={{ width: 32, height: 32 }} />
                <Dropdown
                  className={"alarm"}
                  id={"alarm-menu"}
                  menus={chatMenu}
                  anchorEl={chatEl}
                  setAnchorEl={setChatEl}
                ></Dropdown>
              </IconButton>
              <IconButton
                onClick={alarmOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={alarmEl ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={alarmEl ? "true" : undefined}
              >
                <NotificationsIcon sx={{ width: 32, height: 32 }} />
                <Dropdown
                  className={"alarm"}
                  id={"alarm-menu"}
                  menus={alarmMenu}
                  anchorEl={alarmEl}
                  setAnchorEl={setAlarmEl}
                ></Dropdown>
              </IconButton>
              {/*<Tooltip title="Account settings"> */}
              <IconButton
                onClick={accountOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={accountEl ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={accountEl ? "true" : undefined}
              >
                <AccountCircle sx={{ width: 32, height: 32 }} />
                <Dropdown
                  id={"account-menu"}
                  menus={accountMenu}
                  anchorEl={accountEl}
                  setAnchorEl={setAccountEl}
                ></Dropdown>
              </IconButton>
              {/* </Tooltip>*/}
            </Box>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인 / 회원가입</Link>
          </li>
        </>
      )}
    </ul>
  );
};
const CustomizedInputBase = () => {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 400 }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="검색"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => {
          console.log("hi");
        }}
      >
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
};
