import "./default.css";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import { Fragment, useState } from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import Box from "@mui/material/Box";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Logout from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Dropdown from "../utils/Dropdown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const Header = () => {
  const [loginId, setLoginId] = useState("user01");
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
  const accountMenu = [
    {
      name: "내 정보",
      icon: <InfoIcon />,
    },
    {
      name: "나의 일정",
      icon: <CalendarTodayIcon />,
    },
  ];
  const alarmMenu = [
    {
      name: "안녕하세요",
      icon: <TagFacesIcon />,
    },
    {
      name: "잘가요",
      icon: <TagFacesIcon />,
    },
  ];
  const [anchorEl, setAnchorEl] = useState(null);

  const accountOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const accountClose = () => {
    setAnchorEl(null);
  };
  return (
    <ul className="user-menu">
      {loginId ? (
        <>
          <li>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography sx={{ minWidth: 100 }}>Contact</Typography>
              <Typography sx={{ minWidth: 100 }}>Profile</Typography>
              <IconButton
                size="small"
                sx={{ ml: 2 }}
                aria-controls={anchorEl ? "alarm-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? "true" : undefined}
              >
                <NotificationsIcon sx={{ width: 32, height: 32 }} />
              </IconButton>
              {/*<Tooltip title="Account settings"> */}
              <IconButton
                onClick={accountOpen}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={anchorEl ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={anchorEl ? "true" : undefined}
              >
                <AccountCircle sx={{ width: 32, height: 32 }} />
                <Dropdown
                  id={"account-menu"}
                  menus={accountMenu}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                ></Dropdown>
              </IconButton>
              {/* </Tooltip>*/}
            </Box>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to="/login">로그인</Link>
          </li>
          <li>
            <Link to="/join">회원가입</Link>
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
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <AccountCircle sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <InfoIcon /> 내 정보
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <AccountCircle /> My account
        </MenuItem>
        <MenuItem onClick={handleClose}>Add another account</MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
