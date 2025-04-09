import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({ type, list, data, setData }) {
  const handleChange = (e) => {
    setData(e.target.value);
  };

  return (
    <FormControl
      variant="standard"
      sx={{ minWidth: 100, marginLeft: 2 }}
      size="small"
    >
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={data}
        onChange={handleChange}
        label={type}
      >
        <MenuItem value="">
          <em>{type}</em>
        </MenuItem>
        {list.map((item) => {
          return <MenuItem value={item}>{item}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}
