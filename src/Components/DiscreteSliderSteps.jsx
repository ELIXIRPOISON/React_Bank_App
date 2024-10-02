import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext(value) {
  return `${value}°C`;
}

export default function DiscreteSliderSteps() {

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        aria-label="Small steps"
        defaultValue={0.2}
        getAriaValueText={valuetext}
        step={0.2}
        marks
        min={0}
        max={1}
        valueLabelDisplay="auto"
        onChange={(e)=>{console.log('hi there!', e.target.value)}}
      />
    </Box>
  );
}
