import { useEffect, useState } from "react";

import {  
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ColormapOptions } from './colormapOptions';
import { ColorBar } from '../colorBar';

export const ConfigurableColorBar = ({ VMIN, VMAX, colorMap }) => {
  const [currVMIN, setCurrVMIN] = useState(VMIN);
  const [currVMAX, setCurrVMAX] = useState(VMAX);
  const [currColorMap, setCurrColorMap] = useState(colorMap);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <ColorBar
          VMIN={currVMIN}
          VMAX={currVMAX}
          colorMap={currColorMap}
          STEP={(currVMAX-currVMIN)/5}
        />
      </AccordionSummary>
      <AccordionDetails>
        <ColormapOptions
          VMIN={VMIN}
          VMAX={VMAX}
          colorMap={colorMap}
          setCurrVMAX={setCurrVMAX}
          setCurrVMIN={setCurrVMIN}
          setCurrColorMap={setCurrColorMap}
        />
      </AccordionDetails>
    </Accordion>
  )
}
