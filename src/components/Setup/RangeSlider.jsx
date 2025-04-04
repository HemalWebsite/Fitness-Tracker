import React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

function RangeSlider({ min, max, defaultValue, label, onChange }) {
  const [value, setValue] = React.useState(defaultValue || min);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box sx={{ width: 300, my: 2 }}>
      <Typography gutterBottom>{label}</Typography>
      <Slider
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        aria-labelledby="range-slider"
      />
      <Typography>Selected Value: {value}</Typography>
    </Box>
  );
}

export default RangeSlider;
