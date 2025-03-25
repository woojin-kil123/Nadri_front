import "./default.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MessageIcon from "@mui/icons-material/Message";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "./AccountMenu";

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
          <Link to="/board/list">플래너</Link>
        </li>
        <li>
          <Link to="#">여행 정보</Link>
        </li>
        <li>
          <Link to="#">리뷰</Link>
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
  return (
    <ul className="user-menu">
      {loginId ? (
        <>
          <li>
            <AccountMenu />
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
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton color="primary" sx={{ p: "10px" }} aria-label="directions">
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
};
const Icon = () => {
  const menuId = "primary-search-account-menu";

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MessageIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls={menuId}
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Box>
    </>
  );
};
