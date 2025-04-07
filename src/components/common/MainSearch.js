import {
  IconButton,
  InputBase,
  Paper,
  MenuItem,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import "./mainSearch.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";

const MainSearch = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className="main-search">
      <Stack direction="row" spacing={2}>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
      <IconButton
        sx={{ p: "10px" }}
        aria-label="menu"
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MenuIcon />
      </IconButton>
      <Autocomplete
        sx={{
          flexGrow: "1",
        }}
        multiple
        id="tags-standard"
        options={top100Films}
        getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="검색"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px", // 둥근 테두리
                backgroundColor: "#ffffff", // 배경색
                "& fieldset": {
                  borderColor: "#d6d6d6", // 기본 테두리 색
                },
                "&:hover fieldset": {
                  borderColor: "#27b778", // 호버 시 테두리 색
                  cursor: "pointer",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#27b778", // 포커스 시 테두리 색
                  borderWidth: "2px",
                },
              },
            }}
          />
        )}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon sx={{ width: "30px", height: "30px" }} />
      </IconButton>
    </div>
  );
};
export default MainSearch;

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
