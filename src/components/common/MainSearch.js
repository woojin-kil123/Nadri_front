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
import "./mainSearch.css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";

const MainSearch = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const placeType = useRecoilValue(placeTypeState);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [option, setOption] = useState([
    { title: "2박3일 여행", location: "부산" },
  ]);

  const handleMenuClick = (typeName) => {
    const newTag = { title: typeName };
    if (!selectedTags.some((tag) => tag.title === newTag.title)) {
      setSelectedTags((prev) => [...prev, newTag]);
    }
  };
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
                    {placeType.map((type, i) => (
                      <MenuItem
                        key={"cat-" + i}
                        onClick={() => handleMenuClick(type.name)}
                      >
                        {type.name}
                      </MenuItem>
                    ))}
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
        disableCloseOnSelect
        options={option}
        getOptionLabel={(option) => option.title}
        value={selectedTags}
        inputValue={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === "input") {
            setInputValue(newInputValue);
          }
        }}
        onChange={(event, newValue, reason, details) => {
          if (reason === "selectOption" && details?.option) {
            // 드롭다운에서 선택 시 텍스트만 채움
            setInputValue(details.option.title);
          } else if (reason === "removeOption") {
            // X 버튼 클릭 시 태그 삭제
            setSelectedTags(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="검색"
            onClick={(e) => {
              // 사용자 정의 함수 호출
              console.log("검색창 클릭됨!");
              setInputValue(e.target.value);
              // 필요하면 드롭다운 열기 강제
              params.inputProps.onClick?.(e); // 기존 동작도 유지
            }}
            onFocus={(e) => {
              console.log("검색창 포커스됨!");
              // 포커스 시 동작 커스터마이징 가능
            }}
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
