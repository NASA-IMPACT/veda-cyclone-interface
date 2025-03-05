import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { useMapbox } from "../../context/mapContext";
import { HamburgerControl } from "./hamburger";
import { MeasureDistanceControl } from "./measureDistance";
import { ClearMeasurementControl } from "./clearMeasurement";
import { LayerVisibilityControl } from "./layerVisibility";
import { HomeControl } from "./home";
import { IntensityControl } from "./intensity";

import "./index.css";

export const MapControls = ({
  measureMode,
  onClickHamburger,
  onClickMeasureMode,
  onClickClearIcon,
  clearMeasurementIcon,
  mapScaleUnit,
  handleResetHome,
  openDrawer,
  selectedDataProductIds
}) => {
  const [ intensityControlEnabled, setIntensityControlEnabled ] = useState(false);
  const { map } = useMapbox();
  const customControlContainer = useRef();

  useEffect(() => {
    if (!map) return;

    const hamburgerControl = new HamburgerControl(onClickHamburger);
    const mapboxNavigation = new mapboxgl.NavigationControl({showCompass: false});
    const layerVisibilityControl = new LayerVisibilityControl();
    const homeControl = new HomeControl(handleResetHome);

    const hamburgerControlElem = hamburgerControl.onAdd(map);
    const homeControlElem = homeControl.onAdd(map);
    // const restoreControlElem = restoreControl.onAdd(map);
    const mapboxNavigationElem = mapboxNavigation.onAdd(map);
    const layerVisibilityControlElem = layerVisibilityControl.onAdd(map);

    const mapboxCustomControlContainer = customControlContainer.current;
    mapboxCustomControlContainer.append(hamburgerControlElem);
    mapboxCustomControlContainer.append(homeControlElem);
    // mapboxCustomControlContainer.append(restoreControlElem);
    mapboxCustomControlContainer.append(mapboxNavigationElem);
    mapboxCustomControlContainer.append(layerVisibilityControlElem);

    return () => {
      // clean ups
        if (hamburgerControl) hamburgerControl.onRemove();
        if (mapboxNavigation) mapboxNavigation.onRemove();
        if (layerVisibilityControl) layerVisibilityControl.onRemove();
        if (homeControl) homeControl.onRemove();
        // if (restoreControl) restoreControl.onRemove();
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const measurementControl = new MeasureDistanceControl(
      measureMode,
      onClickMeasureMode
    );

    if (measurementControl) {
      const mapboxCustomControlContainer = document.querySelector("#mapbox-custom-controls");
      const measurementControlElem = measurementControl.onAdd(map);
      mapboxCustomControlContainer.append(measurementControlElem);
    }

    return () => {
      // clean ups
      if (measurementControl) {
        measurementControl.onRemove();
      }
    };
  }, [map, measureMode]);

  useEffect(() => {
    if (!map) return;

    const clearMeasurementControl = clearMeasurementIcon
      ? new ClearMeasurementControl(onClickClearIcon)
      : null;

    if (clearMeasurementIcon) {
      const mapboxCustomControlContainer = document.querySelector("#mapbox-custom-controls");
      const clearMeasurementControlElem = clearMeasurementControl.onAdd(map);
      mapboxCustomControlContainer.append(clearMeasurementControlElem);
    }

    return () => {
      // clean ups
      if (clearMeasurementControl && clearMeasurementIcon) {
        clearMeasurementControl.onRemove();
      }
    };
  }, [map, clearMeasurementIcon, measureMode]);

  useEffect(() => {
    const unit = mapScaleUnit === "km" ? "metric" : "imperial";
    if (!map) return;
    const scaleControl = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: unit,
    });

    if (scaleControl) {
      map.addControl(scaleControl);
    }

    return () => {
      // clean ups
      if (scaleControl) map.removeControl(scaleControl);
    };
  }, [map, mapScaleUnit, measureMode]);

  useEffect(() => {
    if (!map) return;
    let popup = null;
    let popupElem = null;

    const mouseClickHandler = async (e) => {
      if (popupElem) popupElem.remove();
      // get the value from the pointer
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      const collectionId = "gpm_imerg-cyclone-beryl";
      const itemId = "IMERG_precipitation_2024-07-11T20%3A29%3A59Z";
      const assets = "cog_default";
      let resultHTML = "";
      // TODO: use that to get the actual intensity value
      try {
        const url = `http://dev.openveda.cloud/api/raster/collections/${collectionId}/items/${itemId}/point/${lng},${lat}?bidx=1&assets=${assets}&unscale=false&resampling=nearest&reproject=nearest`
        const response = await fetch(url);
        const result = await response.json();
        resultHTML = `
          <div>
            Value: ${result.values[0]} \n
          </div>
          <div>
            Band Name: ${result.band_names}
          </div>
        `;

      } catch(error) {
        resultHTML = "<p>No Data for the clicked location</p>"
      } finally {
        // show it in the tooltip
        const el = document.createElement('div');
        popupElem = el;
        el.className = 'marker';
        const text = resultHTML;
        addTooltip(el, lng, lat, text);
      }

    }

    const addTooltip = (element, longitude, latitude, text) => {
      let marker = new mapboxgl.Marker(element)
      .setLngLat([longitude, latitude])
      .addTo(map);

      const tooltipContent = text;
      popup = new mapboxgl.Popup({
          closeButton: false,
          offset: [-3, -15],
          anchor: 'bottom'
      }).setHTML(tooltipContent);
      marker.setPopup(popup);
      popup.addTo(map);
      // popup.remove() //TODO: do this on another click.
      return marker;
    }

    const intensityControlClickHandler = () => {
      setIntensityControlEnabled(!intensityControlEnabled);
    }

    if (intensityControlEnabled) {
      map.on("click", mouseClickHandler);
    }

    const intensityControl = new IntensityControl(intensityControlClickHandler, intensityControlEnabled);
    const intensityControlElem = intensityControl.onAdd(map);
    const mapboxCustomControlContainer = customControlContainer.current;
    mapboxCustomControlContainer.append(intensityControlElem);

    return () => {
      if (intensityControl) intensityControl.onRemove();
      if (map) map.off("click", mouseClickHandler);
      if (popup) popup.remove();
    }
  }, [map, intensityControlEnabled]);

  return (
    <div id="mapbox-custom-controls" ref={customControlContainer} style={{ right: openDrawer ? "30.7rem" : "0.5rem" }}></div>
  );
};
