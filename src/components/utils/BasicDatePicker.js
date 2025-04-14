import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function DatePickerValue(props) {
  const [date, setDate] = [props.date, props.setDate];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker", "DatePicker"]}>
        <DatePicker
          label="Controlled picker"
          value={date}
          onChange={(newDate) => {
            setDate(newDate);
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
