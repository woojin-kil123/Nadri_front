import "./default.css";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
  memberLevelState,
  memberLeveltate,
} from "../utils/RecoilData";
import axios from "axios";
import MainSearch from "../search/MainSearch";

const Header = () => {
  const isLogin = useRecoilValue(isLoginState);
  console.log(isLogin);
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/image/nadri_logo.svg" />
        </Link>
      </div>
      <MainNavi></MainNavi>
      <div className="header-search">
        <MainSearch />
      </div>
      <HeaderLink isLogin={isLogin} />
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
          <Link to="/place">여행 정보</Link>
        </li>
        <li>
          <Link to="/review">리뷰</Link>
        </li>
      </ul>
    </nav>
  );
};
const HeaderLink = (props) => {
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
  const isLogin = props.isLogin;
  const navigate = useNavigate();
  const logout = () => {
    setMemberNickname("");
    setMemberLevel(0);
    delete axios.defaults.headers.common["Authorization"];
    window.localStorage.removeItem("refreshToken");
  };

  const accountMenu = [
    memberLevel == 1 &&
      new DropdownItem(<InfoIcon />, memberNickname + "님의 정보", () => {
        navigate("/mypage");
      }),
    memberLevel == 1 &&
      new DropdownItem(<CalendarTodayIcon />, "나의 일정", () => {
        navigate("/myplan");
      }),
    memberLevel == 2 &&
      new DropdownItem(<AdminPanelSettingsIcon />, "관리자 페이지", () => {
        navigate("/admin");
      }),
    new DropdownItem(<Logout />, "로그아웃", logout),
  ].filter(Boolean);
  const alarmMenu = [
    new DropdownItem(<TagFacesIcon />, "안녕하세요", null),
    new DropdownItem(<TagFacesIcon />, "잘가요", null),
  ];

  const [accountEl, setAccountEl] = useState(null);
  const accountOpen = (e) => {
    setAccountEl(e.currentTarget);
  };
  const [alarmEl, setAlarmEl] = useState(null);
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
