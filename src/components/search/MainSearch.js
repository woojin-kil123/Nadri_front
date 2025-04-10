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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MainSearch = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const placeType = useRecoilValue(placeTypeState);
  const [selectedTags, setSelectedTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [keyword, setKeyword] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const handleMenuClick = (typeName) => {
    const newTag = { title: typeName };
    if (!selectedTags.some((tag) => tag.title === newTag.title)) {
      setSelectedTags((prev) => [...prev, newTag]);
      // DOM이 다시 렌더링된 다음에 input에 포커스
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);

      // 다음 렌더 프레임에서 드롭다운 열기 → MUI의 내부 close() 이후
      requestAnimationFrame(() => {
        setDropdownOpen(true);
      });
    }
    setOpen(false);
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
  //필터가 바뀌거나 검색어 입력시 조회하는 함수
  const selectKeyword = (newInputValue) => {
    const query = newInputValue ? newInputValue : "";
    const arr = placeType.filter((type, _) =>
      selectedTags.find((tag, _) => type.name === tag.title)
    );
    const type = arr.map((type, _) => `&type=${type.id}`);

    axios
      .get(
        `${
          process.env.REACT_APP_BACK_SERVER
        }/search/keyword?query=${query}${type.join("")}`
      )
      .then((res) => {
        console.log(res.data);
        const newKeyword = res.data.map((keyword, _) => {
          return {
            title: keyword,
          };
        });
        setKeyword(newKeyword);
      });
  };
  //tag 가 바뀌면 조회
  useEffect(() => {
    selectedTags.length > 0 && selectKeyword();
  }, [selectedTags]);
  const doSearch = () => {
    const arr = placeType.filter((type, _) =>
      selectedTags.find((tag, _) => type.name === tag.title)
    );
    const type = arr.map((type, _) => `&type=${type.id}`);

    navigate(`/search?query=${inputValue}${type.join("")}`);
  };
  return (
    <form
      className="main-search"
      onSubmit={(e) => {
        e.preventDefault();
        doSearch();
      }}
    >
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
        open={dropdownOpen}
        onOpen={() => {}}
        onClose={() => setDropdownOpen(false)}
        sx={{
          flexGrow: "1",
        }}
        multiple
        id="tags-standard"
        disableCloseOnSelect
        options={keyword}
        getOptionLabel={(keyword) => {
          if (typeof keyword === "string") return keyword;
          if (!keyword || typeof keyword.title !== "string") return "";
          return keyword.title;
        }}
        value={selectedTags}
        inputValue={inputValue}
        noOptionsText="추천 키워드가 없습니다"
        onInputChange={(event, newInputValue, reason) => {
          if (reason !== "input") return;
          setInputValue(newInputValue);
          // 한글 한 글자 완성됐을 때만 (예: ㅇ+ㅏ → 아)
          const lastChar = newInputValue.slice(-1);
          const isKoreanSyllable =
            lastChar &&
            lastChar.charCodeAt(0) >= 0xac00 &&
            lastChar.charCodeAt(0) <= 0xd7a3;
          if (!isKoreanSyllable) return;
          setDropdownOpen(true);
          selectKeyword(newInputValue);
        }}
        onChange={(event, newValue, reason, details) => {
          if (reason === "selectOption" && details?.option) {
            setInputValue(details.option.title);
          } else if (reason === "removeOption") {
            setSelectedTags(newValue);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={inputRef}
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
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={doSearch}
      >
        <SearchIcon sx={{ width: "30px", height: "30px" }} />
      </IconButton>
    </form>
  );
};
export default MainSearch;
