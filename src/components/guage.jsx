import React from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { Box } from '@mui/material';

const GaugeComponent = ({ value = 0, height, width = 200, color = '#52b202', MV }) => {
  const safeValue = Number(value) || 0;
  const safeMaxValue = Number(MV) || 100;
  const percentage = Math.round((safeValue / safeMaxValue) * 100);

  return (
    <Box sx={{ position: 'relative', width: width, height: height }}>
      <Gauge
        width={width}
        height={height*0.9}
        value={percentage}
        cornerRadius="50%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: height * 0.2,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: color,
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    </Box>
  );
};

export default GaugeComponent;
