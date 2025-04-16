import { Search } from "@mui/icons-material";
import {
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { useState } from "react";

const areaList = [
  { name: "서울", lat: 37.5665, lng: 126.978 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "대구", lat: 35.8722, lng: 128.6025 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "광주", lat: 35.1595, lng: 126.8526 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "울산", lat: 35.5384, lng: 129.3114 },
  { name: "세종", lat: 36.48, lng: 127.289 },
  { name: "경기", lat: 37.4138, lng: 127.5183 },
  { name: "강원", lat: 37.8228, lng: 128.1555 },
  { name: "충북", lat: 36.6357, lng: 127.4917 },
  { name: "충남", lat: 36.5184, lng: 126.8 },
  { name: "전북", lat: 35.7167, lng: 127.1442 },
  { name: "전남", lat: 34.8161, lng: 126.4629 },
  { name: "경북", lat: 36.4919, lng: 128.8889 },
  { name: "경남", lat: 35.4606, lng: 128.2132 },
  { name: "제주", lat: 33.4996, lng: 126.5312 },
];

const CustomizedInputBase = ({ setMapCenter, setMapLevel }) => {
  const [input, setInput] = useState("");
  const [suggest, setSuggest] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const matches = areaList.filter((a) => a.name.includes(value));
    setSuggest(matches);
  };

  const handleSelect = (area) => {
    setInput(area.name);
    setSuggest([]);
    setMapCenter({ lat: area.lat, lng: area.lng });
    setMapLevel(6);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && suggest.length > 0) {
      e.preventDefault();
      handleSelect(suggest[0]);
    }
  };

  const handleSearchIcon = () => {
    if (suggest.length > 0) {
      handleSelect(suggest[0]);
    }
  };

  return (
    <Paper
      sx={{
        position: "relative",
        margin: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <InputBase
          sx={{ p: 1, ml: 1, flex: 1, fontSize: "15px" }}
          placeholder="지역 검색 (예: 제주)"
          value={input}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
        <IconButton type="button" onClick={handleSearchIcon}>
          <Search />
        </IconButton>
      </div>
      {suggest.length > 0 && (
        <List
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {suggest.map((area, idx) => (
            <ListItem key={idx} disablePadding>
              <ListItemButton onClick={() => handleSelect(area)}>
                <ListItemText primary={area.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default CustomizedInputBase;
