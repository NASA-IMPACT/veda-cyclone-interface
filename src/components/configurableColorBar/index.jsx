import {  
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ColormapOptions } from './colormapOptions';
import { ColorBar } from '../colorBar';

export const ConfigurableColorBar = ({ VMIN, VMAX, colorMap }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <ColorBar
          VMIN={VMIN}
          VMAX={VMAX}
          colorMap={colorMap}
          STEP={(VMAX-VMIN)/5}
        />
      </AccordionSummary>
      <AccordionDetails>
        <ColormapOptions
          VMIN={VMIN}
          VMAX={VMAX}
          colorMap={colorMap}
        />
      </AccordionDetails>
    </Accordion>
  )
}
