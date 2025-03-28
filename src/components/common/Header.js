import "./default.css";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import InfoIcon from "@mui/icons-material/Info";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Dropdown from "../utils/Dropdown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import { DropdownItem } from "../utils/metaSet";
import { Logout, Map } from "@mui/icons-material";

import { useRecoilState, useRecoilValue } from "recoil";
import {
  isLoginState,
  isPlannerState,
  loginNicknameState,
  memberTypeState,
} from "../utils/RecoilData";
import axios from "axios";

const Header = () => {
  const isLogin = useRecoilValue(isLoginState);
  console.log(isLogin);
  return (
    <header className="header">
      <div>
        <div className="logo">
          <Link to="/">NADRI</Link>
        </div>
        <MainNavi></MainNavi>

        <HeaderLink isLogin={isLogin} />
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
          <Link to="/tour">여행 정보</Link>
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
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const logout = () => {
    setMemberNickname("");
    setMemberType(0);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
  };
  const accountMenu = [
    new DropdownItem(<InfoIcon />, memberNickname + "님의 정보", () => {
      navigate("/mypage");
    }),
    new DropdownItem(<CalendarTodayIcon />, "나의 일정", () => {
      navigate("/myplan");
    }),
    new DropdownItem(<Logout />, "로그아웃", logout),
  ];
  const alarmMenu = [
    new DropdownItem(<TagFacesIcon />, "안녕하세요", null),
    new DropdownItem(<TagFacesIcon />, "잘가요", null),
  ];

  const [accountEl, setAccountEl] = useState(null);
  const [alarmEl, setAlarmEl] = useState(null);

  const accountOpen = (e) => {
    setAccountEl(e.currentTarget);
  };
  const alarmOpen = (e) => {
    setAlarmEl(e.currentTarget);
  };

  return (
    <ul className="user-menu">
      {isLogin ? (
        <>
          <li>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
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
