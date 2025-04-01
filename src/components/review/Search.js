import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import "./review.css";
import { useNavigate } from "react-router-dom";
const Search = () => {
  return (
    <section className="section">
      <div className="page-title">어떤 리뷰를 작성하시겠습니까?</div>
      <div className="search">
        <CustomizedInputBase />
      </div>
    </section>
  );
};
const CustomizedInputBase = () => {
  const navigate = useNavigate();
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 600 }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="리뷰 작성하실 곳을 검색해 주세요"
        inputProps={{ "aria-label": "search google maps" }}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={() => {
          navigate("/write");
        }}
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default Search;
