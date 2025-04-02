export const addSourceLayerToMap = (map, feature, sourceId, layerId, VMIN=250, VMAX=300, colorMap="magma") => {
    if (!map || (sourceExists(map, sourceId) && layerExists(map, layerId))) return;

    const collection = feature.collection; // feature.collection

    // const assets = "rad"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
    const assets = "cog_default"; // first element in the asset json object. i.e. Object.keys(features.assets)[0]
    let itemId = feature.id;

    const TILE_URL =
        `${process.env.REACT_APP_RASTER_API_URL}/collections/${collection}/items/${itemId}/tiles/WebMercatorQuad/{z}/{x}/{y}@1x` +
        "?assets=" + assets +
        "&bidx=1" +
        "&colormap_name=" + colorMap +
        "&rescale=" + VMIN + "%2C" + VMAX;
        // "&nodata=-9999";

    map.addSource(sourceId, {
        type: "raster",
        tiles: [TILE_URL],
        tileSize: 256,
        bounds: feature.bbox,
    });

    map.addLayer({
        id: layerId,
        type: "raster",
        source: sourceId,
        layout: {
            visibility: 'none',  // Set the layer to be hidden initially
        },
        paint: { }
    });
}

export const addSourcePointToMap = (map, feature, polygonSourceId, polygonLayerId, dataProductId) => {
    if (!map || (sourceExists(map, polygonSourceId) && layerExists(map, polygonLayerId))) return;

    map.addSource(polygonSourceId, {
        type: "geojson",
        data: feature
    });

    map.addLayer({
        id: polygonLayerId,
        type: "circle",
        source: polygonSourceId,
        layout: {},
        paint: {
            "circle-color": getPointColor(dataProductId),
            "circle-opacity": 0.3,
            "circle-stroke-color": getPointColor(dataProductId),
            "circle-stroke-opacity": 1,
            "circle-stroke-width": 2,
        }
    });
}

// TODO change to get it from datatree or atleast a single point

function getPointColor(dataProductId) {
    if (dataProductId.includes("public.path_point")) {
        return [
            'match',
            ['get', 'category'],
            "EX", "#E1E1E1",
            "TD", "#CCCCCC",
            "TS", "#00C5FF",
            "C1", "#55FF00",
            "C2", "#FFFF73",
            "C3", "#FFAA00",
            "C4", "#E60000",
            "C5", "#FF00C5",
            '#20B2AA' // Default - Gray
        ]
    } else {
        return "#20B2AA"
    }
}

export const addSourceLineToMap = (map, feature, polygonSourceId, polygonLayerId, dataProductId) => {
    if (!map || (sourceExists(map, polygonSourceId) && layerExists(map, polygonLayerId))) return;

    map.addSource(polygonSourceId, {
        type: "geojson",
        data: feature
    });

    map.addLayer({
        id: polygonLayerId,
        type: "line",
        source: polygonSourceId,
        layout: {},
        paint: {
            "line-width": getLineStrokeWidth(dataProductId),
            "line-color": getLineColor(dataProductId)
        }
    });
}

function getLineColor(dataProductId) {
    if (dataProductId.includes("public.wind_vectors")) {
        return [
            'interpolate',
            ['linear'],
            ['get', 'wind_speed_knots'],
            0,	"#808080", // (Gray)
            5,	"#00BFFF", // (Light Blue)
            10,	"#0000FF", // (Blue)
            15,	"#00FF00", // (Green)
            20,	"#FFFF00", // (Yellow)
            25,	"#FFA500", // (Orange)
            30,	"#FF0000", // (Red)
            35,	"#A52A2A", // (Brown)
            40,	"#FF00FF", // (Magenta)
            45,	"#800080", // (Purple)
            50, "#4B0082", // (Dark // Purple)
        ]
    } else if (dataProductId.includes("public.path_line")) {
        return "#000000"
    } else {
        return "#20B2AA"
    }
}

function getLineStrokeWidth(dataProductId) {
    if (dataProductId.includes("public.path_line")) {
        return 6
    }
    if (dataProductId.includes("swath")) {
        return 4
    } else {
        return 2
    }
}

export const addSourcePolygonToMap = (map, feature, polygonSourceId, polygonLayerId, dataProductId) => {
    if (!map || (sourceExists(map, polygonSourceId) && layerExists(map, polygonLayerId))) return;

    map.addSource(polygonSourceId, {
        type: "geojson",
        data: feature
    });

    map.addLayer({
        id: polygonLayerId,
        type: "fill",
        source: polygonSourceId,
        layout: {},
        paint: {
            "fill-antialias": true,
            "fill-opacity": getPolygonOpacity(dataProductId),
            "fill-color": getPolygonColor(dataProductId),
            "fill-outline-color": getPolygonColor(dataProductId)
        }
    });
}

function getPolygonColor(dataProductId) {
    if (dataProductId.includes("public.wind_polygon")) {
        return [
            'interpolate',
            ['linear'],
            ['get', 'radii'],
            34, "#FFFF73",
            50, "#FFAA00",
            64, "#E60000",
        ]
    } else {
        return "#20B2AA"
    }
}

function getPolygonOpacity(dataProductId) {
    if (dataProductId.includes("public.wind_polygon")) {
        return 1;
    } else if (dataProductId.includes("public.modis_swath")) {
        return 0.25;
    }
    else {
        return 0.5
    }
}

export const getSourceId = (idx) => {
    return "raster-source-" + idx;
} 

export const getLayerId = (idx) => {
    return "raster-layer-" + idx;
}

export function layerExists(map, layerId) {
    return !!map.getLayer(layerId);
}

export function sourceExists(map, sourceId) {
    return !!map.getSource(sourceId);
}
