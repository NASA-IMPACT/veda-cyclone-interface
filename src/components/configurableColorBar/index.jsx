import { useEffect, useState } from "react";

import {  
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ColormapOptions } from './colormapOptions';
import { ColorBar } from '../colorBar';

export const ConfigurableColorBar = ({ id, VMIN, VMAX, colorMap, dataProductBasedColorMap, setDataProductBasedColorMap }) => {
  const [currVMIN, setCurrVMIN] = useState(VMIN);
  const [currVMAX, setCurrVMAX] = useState(VMAX);
  const [currColorMap, setCurrColorMap] = useState(colorMap);
  const [isReversed, setIsReverse] = useState(false);

  useEffect(() => {
    // key == dataProduct
    // id == dataProduct + selectedCycloneId
    let v = { ...dataProductBasedColorMap }
    let colorMap = currColorMap;
    if (isReversed) colorMap += "_r";
    v[id] = { // should we base it off id, or key??? `dataProduct` (key) was used previously for the opacity
      colorMap: colorMap,
      VMIN: currVMIN,
      VMAX: currVMAX
    }
    setDataProductBasedColorMap(v)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currVMIN, currVMAX, currColorMap, isReversed])

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
          setIsReverse={setIsReverse}
        />
      </AccordionDetails>
    </Accordion>
  )
}
