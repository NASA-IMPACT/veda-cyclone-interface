import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  TextField, 
  Switch,
  Grid,
  Card
} from '@mui/material';

import { ColorBar } from '../colorBar';
import { COLOR_MAP } from '../colorBar/helper';


export const ColormapOptions = ({VMIN, VMAX, colorMap}) => {
  // State for the input values
  const [minValue, setMinValue] = useState(VMIN);
  const [maxValue, setMaxValue] = useState(VMAX);
  const [reverse, setReverse] = useState(false);
  const [selectedColorbar, setSelectedColorbar] = useState(colorMap);
  
  // Handle changes to the min input value
  const handleMinInputChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setMinValue(value);
    }
  };
  
  // Handle changes to the slider
  const handleSliderChange = (event, newValue) => {
    const [ leftVal, rightVal ] = newValue;
    setMaxValue(rightVal);
    setMinValue(leftVal);
  };
  
  // Handle changes to the max input value
  const handleMaxInputChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setMaxValue(value);
    }
  };
  
  // Handle toggling the reverse switch
  const handleReverseChange = (event) => {
    setReverse(event.target.checked);
  };
  
  // Handle selecting a colorbar
  const handleColorbarClick = (name) => {
    setSelectedColorbar(name);
  };
  
  return (
    <Box sx={{ p: 2, maxWidth: 350, bgcolor: '#f5f5f5', borderRadius: 1 }}>
      <Typography fontWeight="medium" gutterBottom>
        Colormap options
      </Typography>
      
      {/* Rescale section with text input and slider */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Rescale
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={3}>
            <TextField
              value={minValue}
              onChange={handleMinInputChange}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Slider
              value={[minValue, maxValue]}
              onChange={handleSliderChange}
              min={VMIN}
              max={VMAX}
              size="small"
              sx={{ 
                width: '100%',
                // Custom styling to match the image
                '& .MuiSlider-rail': {
                  height: 2,
                },
                '& .MuiSlider-track': {
                  height: 2,
                },
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  border: '2px solid currentColor',
                  backgroundColor: '#fff',
                },
              }}
              disableSwap   // Prevents thumbs from swapping positions
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={maxValue}
              onChange={handleMaxInputChange}
              size="small"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      
      {/* Reverse toggle */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ flex: 1 }}>
          Reverse
        </Typography>
        <Switch
          checked={reverse}
          onChange={handleReverseChange}
          size="small"
        />
      </Box>
      
      {/* Colorbar list */}
      {Object.keys(COLOR_MAP).map((colorbarName) => {
        return (
        <Box 
          key={colorbarName}
          onClick={() => handleColorbarClick(colorbarName)}
          sx={{ 
            mb: 1,
            cursor: 'pointer',
            bgcolor: selectedColorbar === colorbarName ? 'white' : 'transparent',
            borderRadius: 1,
            p: selectedColorbar === colorbarName ? 1 : 0,
          }}
        >
          <Card>
            <ColorBar VMIN={VMIN} VMAX={VMAX} STEP={(VMAX-VMIN)/5} colorMap={colorbarName} skipStep skipLabel={false}/>
          </Card>
        </Box>
      )})}
    </Box>
  );
};
