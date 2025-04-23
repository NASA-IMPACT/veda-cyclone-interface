import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import styled from "styled-components";
import moment from "moment";

import MainMap from '../../components/mainMap';
import { MapLayers } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';
import { LoadingSpinner } from '../../components/loading';
import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { SelectCyclone } from '../../components/select';
import { DatasetCheckbox } from "../../components/checkbox";
import { MeasurementLayer } from '../../components/measurementLayer';

import "./index.css";

const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 12px;
`;

const scaleUnits = {
  KM: "km",
  MILES: "mi",
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: "90%",
  height: "90%",
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 2000,
};

const BERYL_START_DATETIME = "2024-06-26";

export function Dashboard({ dataTreeCyclone, cyclones, dataProducts, zoomLocation, setZoomLocation, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ selectedCycloneId, setSelectedCycloneId ] = useState(cyclones[Object.keys(cyclones)[0]].id);
  const [ selectedDataProductIds, setSelectedDataProductIds ] = useState([]);
  const [ selectedDataProductIdsOpacity, setSelectedDataProductIdsOpacity ] = useState({}); // [key: string(dataProductId)]: number
  const [ dataProductBasedColorMap, setDataProductBasedColorMap ] = useState({}); // For configurable colormap -> [key: string(dataProductId)]: { colorMap: string; vmin: string, vmax: string }

  useEffect(() => {
    console.log("+++>>>>", dataProductBasedColorMap)
  }, [dataProductBasedColorMap])

  const [startDate, setStartDate] = useState(moment(BERYL_START_DATETIME).format()); // TODO: get this time based on the selected cyclone.

  // for animation
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]); // list of subdaily_plumes used for animation
  const [ VMIN, setVMIN] = useState(250);
  const [ VMAX, setVMAX] = useState(300);
  const [ colorMap, setColorMap ] = useState("magma");
  const [ selectedProductIdForAnimation, setSelectedProductIdForAnimation ] = useState();
  // end for animation

  // for modal
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  // end for modal


  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ measureMode, setMeasureMode ] = useState(false);
  const [ clearMeasurementIcon, setClearMeasurementIcon ] = useState(false)
  const [ clearMeasurementLayer, setClearMeasurementLayer ] = useState(false)
  const [ mapScaleUnit, setMapScaleUnit ] = useState(scaleUnits.MILES);

  // handler functions
  const handleSelectedDatasetForAnimation = (dataProductId) => {
    if (!selectedCycloneId || !dataTreeCyclone.current || !dataProductId || !(dataProductId in dataTreeCyclone.current[selectedCycloneId]["dataProducts"])) return;

    setSelectedDataProductIds([]); // reset the layers selected
    setSelectedDataProductIdsOpacity({}) // reset the layers opacity
    // prepare animation
    const stacItemsForAnimation = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dataProductId].dataset.subDailyAssets;
    const { colormap, rescale } = dataTreeCyclone.current[selectedCycloneId]["dataProducts"][dataProductId];
    const vmin = rescale[0][0];
    const vmax = rescale[0][1];
    setColorMap(colormap);
    setVMIN(vmin);
    setVMAX(vmax);
    setSelectedProductIdForAnimation(dataProductId);
    setPlumesForAnimation(stacItemsForAnimation);
  }

  const handleResetHome = () => {
    setSelectedDataProductIds([]); // reset the layers selected
    setSelectedDataProductIdsOpacity({}) // reset the layers opacity
    setPlumesForAnimation([]); // reset the animation
    setSelectedProductIdForAnimation();
    setOpenDrawer(false);
    setZoomLevel(3);
    setZoomLocation([-78.771556, 32.967243]);
    setStartDate(moment(BERYL_START_DATETIME).format());
  }

  // JSX
  return (
    <Box className="fullSize">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <div style={{display: "flex", justifyContent: "flex-end"}}>
            <CloseIcon onClick={handleClose}></CloseIcon>
          </div>
          <iframe
            src="https://deploy-preview-568--visex.netlify.app/stories/cyclones-beryl"
            width="100%"
            height="100%"
            title="Embedded Content"
          />
        </Box>
      </Modal>
      <div id="dashboard-map-container">
        <MainMap>
          <Title>
          <HorizontalLayout>
              <Typography>
                Cyclones
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <SelectCyclone
                cyclones={cyclones}
                selectedCycloneId={selectedCycloneId}
                setSelectedCycloneId={setSelectedCycloneId}
                setOpenDrawer={setOpenDrawer}
              >
              </SelectCyclone>
           </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Data Products
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              {<DatasetCheckbox
                setOpenDrawer={setOpenDrawer}
                setPlumesForAnimation={setPlumesForAnimation}
                dataTreeCyclone={dataTreeCyclone}
                dataProducts={dataProducts}
                selectedCycloneId={selectedCycloneId}
                selectedDataProductIds={selectedDataProductIds}
                setSelectedDataProductIds={setSelectedDataProductIds}
                selectedDataProductIdsOpacity={selectedDataProductIdsOpacity}
                setSelectedDataProductIdsOpacity={setSelectedDataProductIdsOpacity}
                handleSelectedDatasetForAnimation={handleSelectedDatasetForAnimation}
                selectedProductIdForAnimation={selectedProductIdForAnimation}
                setSelectedProductIdForAnimation={setSelectedProductIdForAnimation}
                selectedStartDate={startDate}
              ></DatasetCheckbox> }
            </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Selected Datetime (UTC)
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <DateTimePicker
                sx={{width: "100%"}}
                label="Selected Datetime (UTC)"
                value={moment(startDate)}
                onChange={(newValue) => {
                    setStartDate(newValue.format())
                  }}
              />
            </HorizontalLayout>

            <HorizontalLayout>
              <PlumeAnimation
                plumes={plumesForAnimation}
                colorMap={colorMap}
                vmin={VMIN}
                vmax={VMAX}
              />
            </HorizontalLayout>
          </Title>
          <MapLayers
            dataTreeCyclone={dataTreeCyclone}
            selectedCycloneId={selectedCycloneId}
            selectedDataProductIds={selectedDataProductIds}
            startDate={startDate}
            selectedDataProductIdsOpacity={selectedDataProductIdsOpacity}
            dataProductBasedColorMap={dataProductBasedColorMap}
          />
          <MapControls
            openDrawer={openDrawer}
            measureMode={measureMode}
            onClickHamburger={() => {
              setOpenDrawer((openDrawer) => !openDrawer);
            }}
            onClickMeasureMode={() => {
              setMeasureMode((measureMode) => !measureMode);
            }}
            onClickClearIcon={() => {
              setClearMeasurementLayer(true);
            }}
            clearMeasurementIcon={clearMeasurementIcon}
            mapScaleUnit={mapScaleUnit}
            setMapScaleUnit={setMapScaleUnit}
            handleResetHome={handleResetHome}
            selectedDataProductIds={selectedDataProductIds}
            dataTreeCyclone={dataTreeCyclone}
            dataProducts={dataProducts}
            selectedCycloneId={selectedCycloneId}
            selectedStartDate={startDate}
          />
          <MapZoom zoomLocation={zoomLocation} zoomLevel={zoomLevel} />
          <MeasurementLayer
            measureMode={measureMode}
            setMeasureMode={setMeasureMode}
            setClearMeasurementIcon={setClearMeasurementIcon}
            clearMeasurementLayer={clearMeasurementLayer}
            setClearMeasurementLayer={setClearMeasurementLayer}
            mapScaleUnit={mapScaleUnit}
          />
        </MainMap>
        <PersistentDrawerRight
          open={openDrawer}
          dataTree={dataTreeCyclone}
          selectedCycloneId={selectedCycloneId}
          selectedDataProductIds={selectedDataProductIds}
          dataProductsTemp={dataProducts}
          dataProductBasedColorMap={dataProductBasedColorMap}
          setDataProductBasedColorMap={setDataProductBasedColorMap}
        />
      </div>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
