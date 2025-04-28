import moment from "moment";
import { STACItem, STACCollection, FeatureCollection, FeatureItem, CycloneShapeDataset, DateTime } from "../../../dataModel";

import { CycloneRasterDataset, RasterDataProduct, VectorDataProduct, Cyclone, CycloneMap, VisualizationType, ShapeType, PolygonAsset, LineStringAsset, PointAsset } from "../../../dataModel"

// NEW!!!

interface RasterCollectionDictionary {
    [key: string]: STACCollection
}

interface VectorCollectionDictionary {
    [key: string]: FeatureCollection
}

export function dataTransformationCyclone(STACCollections: STACCollection[][], STACItemsList: STACItem[][], FeatureCollections: FeatureCollection[][], FeatureItemsList: FeatureItem[][]) {
    // transforms the data from STAC api to Cyclone models.
    const cycloneDictionary: CycloneMap = {};
    
    const rasterCollectionDictionary: RasterCollectionDictionary = {};     
    const vectorCollectionDictionary: VectorCollectionDictionary = {};     

    STACCollections.forEach((collectionArr: STACCollection[]) => {
        collectionArr.forEach((collection: STACCollection) => {
            const collectionId = collection.id
            if (!(collectionId in rasterCollectionDictionary)) {
                rasterCollectionDictionary[collectionId] = collection;
            }
        });
    });

    FeatureCollections.forEach((collectionArr: FeatureCollection[]) => {
        collectionArr.forEach((collection: FeatureCollection) => {
            const collectionId = collection.id
            if (!(collectionId in vectorCollectionDictionary)) {
                vectorCollectionDictionary[collectionId] = collection;
            }
        });
    });

    STACItemsList.forEach((items: STACItem[]) => {
        // create a RasterDataProduct
        const collectionName = items[0].collection; // <satellite/data_product>-cyclone-<cyclone_name>
        const acc = collectionName.split("-");
        const lenAcc = acc.length;
        const dataProductNameArr = acc.slice(0, lenAcc-2)

        const cycloneName = acc[lenAcc-1];
        const dataProductName = dataProductNameArr.join("-");

        // sort by data by time
        const sortedData = items.sort((prev: STACItem, next: STACItem): number => {
            const prev_date = new Date(prev.properties.datetime).getTime();
            const next_date = new Date(next.properties.datetime).getTime();
            return prev_date - next_date;
        });

        // create CycloneRasterDataset
        let [lon, lat] = sortedData[0].geometry.coordinates[0][0];
        const cycloneDataset: CycloneRasterDataset = {
            id: dataProductName+"-cyclone-"+cycloneName,
            satellite: dataProductName,
            representationalAsset: sortedData[(0)],
            location: [lon, lat],
            startDate: sortedData[0].properties.datetime,
            endDate: sortedData[sortedData.length - 1].properties.datetime,
            subDailyAssets: [...sortedData],
            getAsset: (dateTime: string) => {
                if (!dateTime) return cycloneDataset.subDailyAssets[0];
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might
                // be attached with the target datetime
                const index = findNearestDatetimeSTACIndex(cycloneDataset.subDailyAssets, dateTimeNoTimezone)
                const nearestAsset: STACItem = cycloneDataset.subDailyAssets[index];
                return nearestAsset;
            },
            getNearestDateTime: (dateTime: string) => {
                if (!dateTime) return dateTime;
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might
                // be attached with the target datetime
                const index = findNearestDatetimeSTACIndex(cycloneDataset.subDailyAssets, dateTimeNoTimezone)
                const nearestAsset: STACItem = cycloneDataset.subDailyAssets[index];
                if (nearestAsset && nearestAsset.properties && nearestAsset.properties.datetime) {
                    const formattedDt = moment.utc(nearestAsset.properties.datetime).format('YYYY-MM-DD hh:mm:ss A'); // remove the timezone information that might
                    return formattedDt;
                }
                return dateTime;
            }
        };
        
        // create RasterDataProduct
        const dataProduct:RasterDataProduct = {
            id: dataProductName+"-cyclone-"+cycloneName,
            type: VisualizationType.Raster,
            name: dataProductName,
            dataset: cycloneDataset,
            description: rasterCollectionDictionary[collectionName].description,
            datetimes: rasterCollectionDictionary[collectionName].summaries.datetime,
            assets: rasterCollectionDictionary[collectionName].renders.dashboard.assets[0],
            rescale: rasterCollectionDictionary[collectionName].renders.dashboard.rescale,
            colormap: rasterCollectionDictionary[collectionName].renders.dashboard.colormap_name,
            units: rasterCollectionDictionary[collectionName].units
        }

        if (!(cycloneName in cycloneDictionary)) {
            // Create Cyclone
            const cyclone:Cyclone = {
                id: "cyclone-"+cycloneName,
                name: cycloneName,
                dataProducts: {}
            }
            cycloneDictionary[cycloneName] = cyclone;
        }
        cycloneDictionary[cycloneName]["dataProducts"][`${dataProductName}`] = dataProduct;
    });

    FeatureItemsList.forEach((items: FeatureItem[]) => {
        // create a RasterDataProduct
        const collectionName = items[0].collection; // <satellite/data_product>-cyclone-<cyclone_name>
        const acc = collectionName.split("_");
        const lenAcc = acc.length;
        const dataProductNameArr = acc.slice(0, lenAcc-2)

        const cycloneName = acc[lenAcc-1];
        const dataProductName = dataProductNameArr.join("_");

        let type: ShapeType = ShapeType.Point;
        let dateTimeSensitive: Boolean = false;
        let sortedItems = items;
        let datetimes: string[] = [];

        if (collectionName.includes("point")) {
            type = ShapeType.Point;
        } else if (collectionName.includes("line")) {
            type = ShapeType.Line;
        } else if (collectionName.includes("polygon")) {
            type = ShapeType.Polygon;
        } else if (collectionName.includes("wind_vectors")) {
            type = ShapeType.Line;
            dateTimeSensitive = true;
            sortedItems = items.sort((prev: PolygonAsset | LineStringAsset | PointAsset, next: PolygonAsset | LineStringAsset | PointAsset): number => {
                const prev_date = new Date(prev.properties.datetime).getTime();
                const next_date = new Date(next.properties.datetime).getTime();
                return prev_date - next_date;
            });
            datetimes = sortedItems.map(item => item.properties.datetime);
        } else if (collectionName.includes("swath")) {
            type = ShapeType.Polygon;
            dateTimeSensitive = true;
            sortedItems = items.sort((prev: PolygonAsset | LineStringAsset | PointAsset, next: PolygonAsset | LineStringAsset | PointAsset): number => {
                const prev_date = new Date(prev.properties.time_start).getTime();
                const next_date = new Date(next.properties.time_start).getTime();
                return prev_date - next_date;
            });
            datetimes = sortedItems.map(item => item.properties.time_start);
        }
        // create CycloneShapeDataset
        const cycloneShapeDataset: CycloneShapeDataset = {
            id: dataProductName+"_cyclone_"+cycloneName,
            type: type,
            dateTimeSensitive: dateTimeSensitive,
            representationalAsset: items[0],
            subDailyAssets: [...sortedItems],
            datetimes: datetimes,
            getAsset: dataProductName.includes("swath") ? (dateTime: string) => { // TODO: Refactor this to be easily integretable
                if (!dateTime || !cycloneShapeDataset.datetimes.length) return cycloneShapeDataset.subDailyAssets;
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might be attached with the target datetime
                const index = findNearestDatetimeIndex(cycloneShapeDataset.datetimes, dateTimeNoTimezone)
                let offset = 5;
                let startIndex = index - offset;
                let endIndex = index + offset;
                if (startIndex < 0) {
                    startIndex = 0
                }
                if (endIndex > cycloneShapeDataset.datetimes.length - 1) {
                    endIndex = cycloneShapeDataset.datetimes.length - 1
                }
                const assetsForDateTime: PolygonAsset[] | LineStringAsset[] | PointAsset[] = cycloneShapeDataset.subDailyAssets.slice(startIndex, endIndex+1);
                return assetsForDateTime;
            } :
            (dateTime: string) => {
                if (!dateTime || !cycloneShapeDataset.datetimes.length) return cycloneShapeDataset.subDailyAssets;
                const dateTimeNoTimezone = moment(dateTime).format('YYYY-MM-DD HH:mm:ss'); // remove the timezone information that might
                // be attached with the target datetime
                const [ startIndex, endIndex ] = findWindowIndex(cycloneShapeDataset.datetimes, dateTimeNoTimezone)
                if (startIndex === -1 || endIndex === -1) return [];
                const assetsForDateTime: PolygonAsset[] | LineStringAsset[] | PointAsset[] = cycloneShapeDataset.subDailyAssets.slice(startIndex, endIndex+1);
                return assetsForDateTime;
            }
        };

        // create VectorDataProduct
        const dataProduct:VectorDataProduct = {
            id: dataProductName+"_cyclone_"+cycloneName,
            type: VisualizationType.Vector,
            name: dataProductName,
            datetimes: datetimes,
            dataset: cycloneShapeDataset,
            description: vectorCollectionDictionary[collectionName].id,
        }

        if (!(cycloneName in cycloneDictionary)) {
            // Create Cyclone
            const cyclone:Cyclone = {
                id: "cyclone-"+cycloneName,
                name: cycloneName,
                dataProducts: {}
            }
            cycloneDictionary[cycloneName] = cyclone;
        }
        cycloneDictionary[cycloneName]["dataProducts"][`${dataProductName}`] = dataProduct;
    });

    return cycloneDictionary;
}

// NOTE: All the below binary search could be made DRY code. However, if the data have to be linearly scanned/filtered once before feeding it to a binary search then the binary search is meaningless. with big O tending to O(n) instead of O(log(n))
// Find better way of making the binary search code DRY.

export function findNearestDatetimeSTACIndex(sortedStacItems: STACItem[], targetDatetime: string) {
    // Given a list of sorted stac items, return the nearest stac item based on the target datetime.
    let l=0;
    let r=sortedStacItems.length - 1;

    const momentTargetDatetime = moment.utc(targetDatetime, 'YYYY-MM-DD HH:mm:ss'); // ignore the timezone information that might be 
    // attached with the target datetime and treat it as utc offset. Its for a fair comparision as the datasets datetime is in UTC.
    let momentLeftIdxDatetime = moment(sortedStacItems[l].properties.datetime);
    let momentRightIdxDatetime = moment(sortedStacItems[r].properties.datetime);

    // edge cases
    if (momentTargetDatetime <= momentLeftIdxDatetime) {
        return l;
    }
    if (momentTargetDatetime >= momentRightIdxDatetime) {
        return r;
    }

    let minNearestNeighbourScore = Infinity;
    let nearestNeighborIdx = 0;

    while (l <= r) {
        const mid = Math.floor((r + l) / 2);
        const midDatetime = sortedStacItems[mid].properties.datetime;
        const momentMidDatetime = moment(midDatetime);

        if (momentMidDatetime === momentTargetDatetime) {
            return mid;
        }
        // else
        if (momentTargetDatetime < momentMidDatetime) {
            // go left
            r = mid-1;
        } else {
            // go right
            l = mid+1
        }
        // also find the nearest neighbour (in the context of datetime)
        let neighbourScore = Math.abs(momentTargetDatetime.diff(momentMidDatetime));
        if (neighbourScore < minNearestNeighbourScore) {
            minNearestNeighbourScore = neighbourScore;
            nearestNeighborIdx = mid;
        }
    }
    // if no exact match found
    return nearestNeighborIdx;
}

export function findNearestDatetimeIndex(sortedDatetime: DateTime[], targetDatetime: string) {
    // Given a list of sorted datetime, return the nearest datetime based on the target datetime.
    let l=0;
    let r=sortedDatetime.length - 1;

    const momentTargetDatetime = moment.utc(targetDatetime, 'YYYY-MM-DD HH:mm:ss'); // ignore the timezone information that might be 
    // attached with the target datetime and treat it as utc offset. Its for a fair comparision as the datasets datetime is in UTC.
    let momentLeftIdxDatetime = moment(sortedDatetime[l]);
    let momentRightIdxDatetime = moment(sortedDatetime[r]);

    // edge cases
    if (momentTargetDatetime <= momentLeftIdxDatetime) {
        return l;
    }
    if (momentTargetDatetime >= momentRightIdxDatetime) {
        return r;
    }

    let minNearestNeighbourScore = Infinity;
    let nearestNeighborIdx = 0;

    while (l <= r) {
        const mid = Math.floor((r + l) / 2);
        const midDatetime = sortedDatetime[mid];
        const momentMidDatetime = moment(midDatetime);

        if (momentMidDatetime === momentTargetDatetime) {
            return mid;
        }
        // else
        if (momentTargetDatetime < momentMidDatetime) {
            // go left
            r = mid-1;
        } else {
            // go right
            l = mid+1
        }
        // also find the nearest neighbour (in the context of datetime)
        let neighbourScore = Math.abs(momentTargetDatetime.diff(momentMidDatetime));
        if (neighbourScore < minNearestNeighbourScore) {
            minNearestNeighbourScore = neighbourScore;
            nearestNeighborIdx = mid;
        }
    }
    // if no exact match found
    return nearestNeighborIdx;
}

export function findWindowIndex(sortedDatetime: DateTime[], targetDatetime: string ): [number, number] {
    if (!sortedDatetime.length || !targetDatetime) {
        return [-1, -1];
    }

    let left = 0;
    let right = sortedDatetime.length - 1;

    if (moment(targetDatetime).isBefore(sortedDatetime[left]) || moment(targetDatetime).isAfter(sortedDatetime[right])) {
        return [-1, -1];
    }

    while (moment(sortedDatetime[left]).isBefore(targetDatetime)) {
        left += 1;
    }
    while (moment(sortedDatetime[right]).isAfter(moment(targetDatetime).add(1, "day"))) {
        right -= 1;
    }

    let offsets = 3;

    left -= offsets;
    right += offsets;

    if (left <= 0) {
        left = 0
    }
    if (right > sortedDatetime.length - 1) {
        right = sortedDatetime.length - 1
    }

    return [left, right];
}
