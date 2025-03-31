import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangeCalendar } from '@mui/x-date-pickers-pro/DateRangeCalendar';
import styles from './CustomDateRangeCalendar.module.css';

function CustomDateRangeCalendar({ onDateChange }) {
  const [value, setValue] = React.useState([null, null]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    onDateChange(newValue); // Send dates back to Setup component
  };

  return (
    <div className={styles.dateRangeContainer}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateRangeCalendar
          calendars={1}
          value={value}
          onChange={handleDateChange}
          className={styles.timelineDropdown}
        />
      </LocalizationProvider>
    </div>

  );
}
export default CustomDateRangeCalendar