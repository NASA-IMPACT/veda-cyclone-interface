import React, { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import styled from "styled-components";
import moment from "moment";

import MainMap from '../../components/mainMap';
import { MarkerFeature } from '../../components/mapMarker';
import { MapLayers } from '../../components/mapLayer';
import { PlumeAnimation } from '../../components/plumeAnimation';
import { MapControls } from "../../components/mapControls";
import { MapZoom } from '../../components/mapZoom';
import { ColorBar } from '../../components/colorBar';
import { LoadingSpinner } from '../../components/loading';
import { PersistentDrawerRight } from "../../components/drawer";
import { Title } from "../../components/title";
import { Search } from "../../components/search";
import { SelectCyclone } from '../../components/select';
import { DatasetCheckbox } from "../../components/checkbox";
import { FilterByDate } from '../../components/filter';
import { Divider, Typography } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import "./index.css";
import { MeasurementLayer } from '../../components/measurementLayer';


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

export function Dashboard({ dataTree, dataTreeCyclone, plumeMetaData, cyclones, dataProducts, zoomLocation, setZoomLocation, zoomLevel, setZoomLevel, loadingData }) {
  // states for data
  const [ selectedCycloneId, setSelectedCycloneId ] = useState(cyclones[Object.keys(cyclones)[0]].id);
  const [ selectedDataProductId, setSelectedDataProductId ] = useState([]);

  const [startDate, setStartDate] = useState(moment("2018-01-01"));

  const [ plumes, setPlumes ] = useState([]); // store all available plumes
  const [ selectedRegionId, setSelectedRegionId ] = useState(""); // region_id of the selected region (marker)
  const prevSelectedRegionId = useRef(""); // to be able to restore to previously selected region.
  const [ selectedPlumes, setSelectedPlumes ] = useState([]); // all plumes for the selected region (marker)
  const [ hoveredPlumeId, setHoveredPlumeId ] = useState(""); // plume_id of the plume which was hovered over

  const [ filteredRegions, setFilteredRegions ] = useState([]); // all regions with the filter applied
  const [ filteredSelectedPlumes, setFilteredSelectedPlumes ] = useState([]); // plumes for the selected region with the filter applied

  const [ plumeIds, setPlumeIds ] = useState([]); // list of plume_ids for the search feature.
  const [ plumesForAnimation, setPlumesForAnimation ] = useState([]); // list of subdaily_plumes used for animation

  const [ showPlumeLayers, setShowPlumeLayers ] = useState(true);

  // states for components/controls
  const [ openDrawer, setOpenDrawer ] = useState(false);
  const [ measureMode, setMeasureMode ] = useState(false);
  const [ clearMeasurementIcon, setClearMeasurementIcon ] = useState(false)
  const [ clearMeasurementLayer, setClearMeasurementLayer ] = useState(false)
  const [ mapScaleUnit, setMapScaleUnit ] = useState(scaleUnits.MILES);

  // handler functions
  const handleSelectedRegion = (regionId) => {
    if (!dataTree.current || !Object.keys(dataTree.current).length || !regionId) return;
    setSelectedRegionId(regionId); // an useEffect handles it further
    setShowPlumeLayers(true); // all the available plumes layers should be visible when region is selected
    prevSelectedRegionId.current = regionId;
    const region = dataTree.current[regionId];
    setZoomLocation(region.location);
    setZoomLevel(null); // take the default zoom level
    setOpenDrawer(true);
    setSelectedPlumes([]); // reset the plumes shown, to trigger re-evaluation of selected plume
  }

  const handleSelectedPlume = (plumeId) => {
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    const { location } = plume;
    handleSelectedPlumeSearch(plumeId);
    handleAnimationReady(plumeId);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
  }

  const handleAnimationReady = (plumeId) => {
    // will make the plume ready for animation.
    if (!plumes || !plumeId) return;

    const plume = plumes[plumeId];
    setPlumesForAnimation(plume.subDailyPlumes);
    // just clear the previous plume layers and not the cards
    setShowPlumeLayers(false);
  }

  const handleSelectedPlumeSearch = (plumeId) => {
    // will focus on the plume along with its plume metadata card
    // will react to update the metadata on the sidedrawer
    if (!plumes || !plumeId) return;
    const plume = plumes[plumeId];
    const { location } = plume;

    setSelectedPlumes([plume]);
    setOpenDrawer(true);
    setZoomLocation(location);
    setZoomLevel(null); // take the default zoom level
    setSelectedRegionId(""); //to reset the plume that was shown
    setPlumesForAnimation([]); // to reset the previous animation
  }

  const handleResetHome = () => {
    setSelectedRegionId("");
    setHoveredPlumeId("");
    setFilteredSelectedPlumes([]);
    setPlumesForAnimation([]);
    setOpenDrawer(false);
    setZoomLevel(4);
    setZoomLocation([-98.771556, 32.967243]);
  }

  const handleResetToSelectedRegion = () => {
    setHoveredPlumeId("");
    setPlumesForAnimation([]);
    if (!prevSelectedRegionId.current) {
      return handleResetHome();
    }
    handleSelectedRegion(prevSelectedRegionId.current);
  }

  // Component Effects
  useEffect(() => {
    if (!dataTree.current) return;

    const plumes = {}; // plumes[string] = Plume
    const regions = []; // string[]
    const plumeIds = []; // string[] // for search
    Object.keys(dataTree.current).forEach(region => {
      regions.push(dataTree.current[region]);
      dataTree.current[region].plumes.forEach(plume => {
        // check what plume is in dataModels.ts
        plumes[plume.id] = plume;
        plumeIds.push(plume.id);
      });
    });
    setPlumes(plumes);
    setPlumeIds(plumeIds); // for search
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current]);

  useEffect(() => {
    if (!dataTree.current || !selectedRegionId) return;
    const plumes = dataTree.current[selectedRegionId].plumes;
    setSelectedPlumes(plumes);
    setPlumesForAnimation([]); // reset the animation
    setShowPlumeLayers(true); // all the available plumes layers should be visible when region is selected
  // the reference to datatree is in current, so see changes with respect to that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree.current, selectedRegionId]);

  // JSX
  return (
    <Box className="fullSize">
      <div id="dashboard-map-container">
        <MainMap>
          <Title>
          <HorizontalLayout>
              <Typography>
                Cyclones
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <SelectCyclone cyclones={cyclones} selectedCycloneId={selectedCycloneId} setSelectedCycloneId={setSelectedCycloneId}></SelectCyclone>
            </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Datasets
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              {<DatasetCheckbox dataProducts={dataProducts} selectedDataProductId={selectedDataProductId} setSelectedDataProductId={setSelectedDataProductId}></DatasetCheckbox> }
            </HorizontalLayout>

            <HorizontalLayout>
              <Typography>
                Start Datetime
              </Typography>
            </HorizontalLayout>
            <HorizontalLayout>
              <DateTimePicker
                sx={{width: "100%"}}
                label="Start Datetime"
                value={startDate}
                onChange={(newValue) => {
                    setStartDate(newValue)
                  }}
              />
            </HorizontalLayout>

            <HorizontalLayout>
              <PlumeAnimation plumes={plumesForAnimation} />
            </HorizontalLayout>
          </Title>
          <MapLayers
            // plumes={filteredSelectedPlumes}
            // handleLayerClick={handleSelectedPlume}
            // hoveredPlumeId={hoveredPlumeId}
            // setHoveredPlumeId={setHoveredPlumeId}
            dataTreeCyclone={dataTreeCyclone}
            selectedCycloneId={selectedCycloneId}
            selectedDataProductId={selectedDataProductId}
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
            handleResetToSelectedRegion={handleResetToSelectedRegion}
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
          setOpen={setOpenDrawer}
          selectedPlumes={filteredSelectedPlumes}
          plumeMetaData={plumeMetaData}
          plumesMap={plumes}
          handleSelectedPlumeCard={handleSelectedPlume}
          hoveredPlumeId={hoveredPlumeId}
          setHoveredPlumeId={setHoveredPlumeId}
        />
      </div>
      <ColorBar/>
      {loadingData && <LoadingSpinner/>}
    </Box>
  );
}
