import { useEffect, useState } from "react";
import { useMapbox } from "../../context/mapContext";
import { addSourceLayerToMap, addSourcePointToMap, addSourceLineToMap, addSourcePolygonToMap, getSourceId, getLayerId, layerExists, sourceExists } from "../../utils";

export const MapLayerRaster = ({ dataProduct, rescale, colormap, handleLayerClick, plumeId, hoveredPlumeId, setHoveredPlumeId, startDate, opacity }) => {
    const { map } = useMapbox();
    const [VMIN, VMAX] = rescale[0];

    useEffect(() => {
        if (!map || !dataProduct) return;

        const feature = dataProduct;
        const rasterSourceId = getSourceId("raster"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);
        const polygonSourceId = getSourceId("polygon"+plumeId);
        const polygonLayerId = getLayerId("polygon"+plumeId);

        addSourceLayerToMap(map, feature, rasterSourceId, rasterLayerId, VMIN, VMAX, colormap);
        map.setPaintProperty(rasterLayerId, "raster-opacity", opacity);

        const onClickHandler = (e) => {
            // handleLayerClick(plumeId);
        }

        const onHoverHandler = (e) => {
            // setHoveredPlumeId(plumeId);
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
    }, [dataProduct, map, handleLayerClick, plumeId, setHoveredPlumeId, startDate]);

    useEffect(() => {
        if (!map || !hoveredPlumeId || !plumeId ) return;

        const polygonLayerId = getLayerId("polygon"+plumeId);
        const rasterLayerId = getLayerId("raster"+plumeId);

        if (hoveredPlumeId !== plumeId) {
            // when the plume is not hovered
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#20B2AA');
            }
            if (layerExists(map, rasterLayerId)) {
                map.setLayoutProperty(rasterLayerId, 'visibility', 'none');
            }
        }

        if (hoveredPlumeId === plumeId) {
            // when the plume is hovered
            if (layerExists(map, rasterLayerId)) {
                map.moveLayer(rasterLayerId);
            }
            if (layerExists(map, polygonLayerId)) {
                map.setPaintProperty(polygonLayerId, 'fill-outline-color', '#0000ff');
            }
        }
    }, [hoveredPlumeId, map, plumeId]);

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

        const onClickHandler = (e) => {
            // handleLayerClick(plumeId);
            // console.log("features-->", e.features, "--", dataProductId)
        }

        const onHoverHandler = (e) => {
            // setHoveredPlumeId(plumeId);
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
                map.off("click", "clusters", onClickHandler);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(dataProducts), dataProductId, datasetType]);
    // Note: JSON stringify used to do deep comparision and avoid shallow comparision. Hence to avoid un-necessary re-renders

    return null;
}

export const MapLayers = ({ dataTreeCyclone, startDate, hoveredPlumeId, handleLayerClick, setHoveredPlumeId, selectedCycloneId, selectedDataProductIds, selectedDataProductIdsOpacity }) => {
    const { map } = useMapbox();
    const [ rasterDataProducts, setRasterDataProducts ] = useState([]);
    const [ vectorDataProducts, setVectorDataProducts ] = useState([]);

    useEffect(() => {
        if (!map) return;
        // use the map reference
        Object.keys(selectedDataProductIdsOpacity).forEach((dataProduct) => {
            const dataProductId = dataProduct + "-cyclone-" + selectedCycloneId;
            // const plumeId = dataProductId
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
                plumeId={dataProduct.dataset.id}
                dataProduct={dataProduct.dataset.getAsset(startDate)}
                rescale={dataProduct.rescale}
                colormap={dataProduct.colormap}
                handleLayerClick={handleLayerClick}
                hoveredPlumeId={hoveredPlumeId}
                setHoveredPlumeId={setHoveredPlumeId}
                opacity={selectedDataProductIdsOpacity[dataProduct.dataset.satellite]}
                startDate={startDate}
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
