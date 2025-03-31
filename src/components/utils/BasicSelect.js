import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";

export default function BasicSelect() {
  const [transport, setTransport] = useState("");

  const handleChange = (e) => {
    setTransport(e.target.value);
  };

  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="demo-simple-select-standard-label">이동수단</InputLabel>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={transport}
        onChange={handleChange}
        label="이동수단"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>대중교통</MenuItem>
        <MenuItem value={20}>자가용</MenuItem>
        <MenuItem value={30}>자전거</MenuItem>
        <MenuItem value={30}>도보</MenuItem>
      </Select>
    </FormControl>
  );
}
