/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import moment from "moment";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePointToMap, addSourceLineToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayerRaster = ({ dataProduct, rescale, colormap, handleLayerClick, layerId, hoveredLayerId, setHoveredPlumeId, startDate, opacity, dataProductBasedColorMap }) => {
    const { map } = useMapbox();
    let [VMIN, VMAX] = rescale[0];

    useEffect(() => {
        if (!map || !dataProduct) return;

        if (layerId in dataProductBasedColorMap) {
            VMIN = dataProductBasedColorMap[layerId]?.VMIN;
            VMAX = dataProductBasedColorMap[layerId]?.VMAX;
            colormap = dataProductBasedColorMap[layerId]?.colorMap;
        }

        const feature = dataProduct;
        const rasterSourceId = getSourceId("raster"+layerId);
        const rasterLayerId = getLayerId("raster"+layerId);
        const polygonSourceId = getSourceId("polygon"+layerId);
        const polygonLayerId = getLayerId("polygon"+layerId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId, VMIN, VMAX, colormap);
        map.setPaintProperty(rasterLayerId, "raster-opacity", opacity);

        const onClickHandler = (e) => {
            // handleLayerClick(layerId);
        }

        const onHoverHandler = (e) => {
            // setHoveredPlumeId(layerId);
        }

        map.setLayoutProperty(rasterLayerId, 'visibility', 'visible');
        map.on("click", polygonLayerId, onClickHandler);
        map.on("mousemove", polygonLayerId, onHoverHandler);

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, rasterLayerId)) map.removeLayer(rasterLayerId);
                if (sourceExists(map, rasterSourceId)) map.removeSource(rasterSourceId);
                if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
                if (sourceExists(map, polygonSourceId)) map.removeSource(polygonSourceId);
                map.off("click", "clusters", onClickHandler);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataProduct, map, handleLayerClick, layerId, setHoveredPlumeId, startDate, dataProductBasedColorMap]);

    useEffect(() => {
        if (!map || !hoveredLayerId || !layerId ) return;

        const polygonLayerId = getLayerId("polygon"+layerId);
        const rasterLayerId = getLayerId("raster"+layerId);

        if (hoveredLayerId !== layerId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredLayerId === layerId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredLayerId, map, layerId]);

    return null;
}

export const MapAllVectorLayer = ({ dataProducts, dataProductId, datasetType }) => {
    const { map } = useMapbox();

    useEffect(() => {
        if (!map || !dataProducts || !dataProducts.length || !datasetType) return;

        const featureCollection = {
            "type": "FeatureCollection",
            "features": dataProducts
        }

        const polygonSourceId = getSourceId("polygon"+dataProductId);
        const polygonLayerId = getLayerId("polygon"+dataProductId);

        if (datasetType === "Point") {
            addSourcePointToMap(map, featureCollection, polygonSourceId, polygonLayerId, dataProductId)
        } else if (datasetType === "Line") {
            addSourceLineToMap(map, featureCollection, polygonSourceId, polygonLayerId, dataProductId)
        } else if (datasetType === "Polygon") {
            addSourcePolygonToMap(map, featureCollection, polygonSourceId, polygonLayerId, dataProductId)
        }

        // Additionally
        let dataProductSwathLayerId = "";
        let dataProductSwathSourceId = "";
        if (dataProductId.includes("swath")) {
            // add a line on the border.
            let swathIdentifier = "-swath-boundary";
            dataProductSwathSourceId = polygonSourceId+swathIdentifier;
            dataProductSwathLayerId = polygonLayerId+swathIdentifier;
            addSourceLineToMap(map, featureCollection, dataProductSwathSourceId, dataProductSwathLayerId, dataProductId);
        }

        let popupElem = "";
        const onClickHandler = (e) => {
            if (popupElem) popupElem.remove();
            if (!(dataProductId.includes("swath") || dataProductId.includes("public.path_point"))) return;
            // handleLayerClick(layerId);
            const el = document.createElement('div');
            popupElem = el;
            el.className = 'marker';

            const { lng, lat } = e.lngLat;
            const resultHTML = getResultHtml(e.features, dataProductId);
            console.log(resultHTML)
            addTooltip(el, lng, lat, resultHTML);
        }

        const getResultHtml = (features, dataProductId) => {
            if (!features?.length || !dataProductId) return "<div></div>"
            const feature = features[0];
            if (dataProductId.includes("swath")) {
                return `
                    <div style="word-wrap: break-word;">
                        <div>Start Date: ${moment(feature.properties.time_start).utc().format("MM/DD/YYYY, HH:mm:ss")} (UTC)</div>
                        <div>End Date: ${moment(feature.properties.time_end).utc().format("MM/DD/YYYY, HH:mm:ss")} (UTC)</div>
                        <div>Producer Granule Id: ${feature.properties.producer_granule_id}</div>
                    </div>
                `;
            }
            if (dataProductId.includes("public.path_point")) {
                return `
                    <div style="word-wrap: break-word;">
                        <div>Date Time: ${moment(feature.properties.datetime).utc().format("MM/DD/YYYY, HH:mm:ss")} (UTC)</div>
                        <div>Category: ${feature.properties.category}</div>
                    </div>
                    `;
            }
            return '<div></div>';
            // default
            // let result = "<div>"
            // Object.keys(features[0].properties).forEach(prop => {
            //     result += "<div>"+ prop + ":" + features[0].properties[prop] + "</div>"
            // })
            // result += "</div>"
            // return result;
        }

        const onHoverHandler = (e) => {
            // setHoveredPlumeId(layerId);
        }

        let popup = "";
        const addTooltip = (element, longitude, latitude, text) => {
            let marker = new mapboxgl.Marker(element)
            .setLngLat([longitude, latitude])
            .addTo(map);

            const tooltipContent = text;
            popup = new mapboxgl.Popup({
                closeButton: false,
                anchor: 'bottom'
            }).setHTML(tooltipContent);
            marker.setPopup(popup);
            popup.addTo(map);
            // popup.remove() //TODO: do this on another click.
            return marker;
          }

        map.on("click", polygonLayerId, onClickHandler);
        map.on("mousemove", polygonLayerId, onHoverHandler);

        return () => {
            // cleanups
            if (map) {
                if (layerExists(map, polygonLayerId)) map.removeLayer(polygonLayerId);
                if (sourceExists(map, polygonSourceId)) map.removeSource(polygonSourceId);
                if (dataProductSwathLayerId && layerExists(map, dataProductSwathLayerId)) map.removeLayer(dataProductSwathLayerId);
                if (dataProductSwathSourceId && sourceExists(map, dataProductSwathSourceId)) map.removeSource(dataProductSwathSourceId);
                if (popup) popup.remove();
                map.off("click", "clusters", onClickHandler);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(dataProducts), dataProductId, datasetType]);
    // Note: JSON stringify used to do deep comparision and avoid shallow comparision. Hence to avoid un-necessary re-renders

    return null;
}

export const MapLayers = ({ dataTreeCyclone, startDate, hoveredLayerId, handleLayerClick, setHoveredPlumeId, selectedCycloneId, selectedDataProductIds, selectedDataProductIdsOpacity, dataProductBasedColorMap }) => {
    const { map } = useMapbox();
    const [ rasterDataProducts, setRasterDataProducts ] = useState([]);
    const [ vectorDataProducts, setVectorDataProducts ] = useState([]);

    useEffect(() => {
        if (!map) return;
        // use the map reference
        Object.keys(selectedDataProductIdsOpacity).forEach((dataProduct) => {
            const dataProductId = dataProduct + "-cyclone-" + selectedCycloneId;
            // const layerId = dataProductId
            const rasterLayerId = getLayerId("raster"+dataProductId);
            try {
                if (layerExists(map, rasterLayerId)) {
                    map.setPaintProperty(rasterLayerId, "raster-opacity", selectedDataProductIdsOpacity[dataProduct]);
                }
            } catch (err) {
                console.error(err);
            }
        });
    }, [map, selectedCycloneId, selectedDataProductIdsOpacity]);

    useEffect(() => {
        if (!map || !dataTreeCyclone) return

        let rasterDP = [];
        let vectorDP = [];
        if (selectedDataProductIds.length) selectedDataProductIds.forEach(productId => {
            try {
                let dp = dataTreeCyclone["current"][selectedCycloneId]["dataProducts"][productId];
                if (dp.type === "Raster") {
                    rasterDP.push(dp);
                } else if (dp.type === "Vector") {
                    vectorDP.push(dp);
                }
            } catch (err) {
                console.error(err);
            }
        });
        setRasterDataProducts(rasterDP);
        setVectorDataProducts(vectorDP);
    }, [startDate, map, dataTreeCyclone, selectedDataProductIds, selectedCycloneId])

    return (<>
        {rasterDataProducts?.length && rasterDataProducts.map((dataProduct) =>
            <MapLayerRaster
                key={dataProduct.dataset.id}
                layerId={dataProduct.dataset.id}
                dataProduct={dataProduct.dataset.getAsset(startDate)}
                rescale={dataProduct.rescale}
                colormap={dataProduct.colormap}
                handleLayerClick={handleLayerClick}
                hoveredLayerId={hoveredLayerId}
                setHoveredPlumeId={setHoveredPlumeId}
                opacity={selectedDataProductIdsOpacity[dataProduct.dataset.satellite]}
                startDate={startDate}
                dataProductBasedColorMap={dataProductBasedColorMap}
            >
            </MapLayerRaster>
        )}
        {vectorDataProducts?.length && vectorDataProducts.map((dataProduct, idx) =>
            <MapAllVectorLayer
                key={ dataProduct.dataset.id+idx }
                dataProducts={ dataProduct.dataset.dateTimeSensitive ? dataProduct.dataset.getAsset(startDate) : dataProduct.dataset.subDailyAssets }
                dataProductId={ dataProduct.dataset.id }
                datasetType={ dataProduct.dataset.type }
            />
        )}
        </>
    );
}
