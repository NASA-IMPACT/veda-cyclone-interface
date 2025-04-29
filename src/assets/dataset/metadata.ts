import { CycloneMeta } from "../../dataModel";

interface CycloneMetaDict {
    [key: string]: CycloneMeta
}

export const CycloneMetas: CycloneMetaDict = {
    "gpm_imerg": {
        id: "gpm_imerg",
        title: "IMERG",
        description: "The Integrated Multi-satellitE Retrievals for GPM (IMERG) is a NASA precipitation dataset that provides global rainfall and snowfall estimates. It merges data from multiple satellites, ground-based sources, and numerical models. IMERG offers near real-time and research-quality precipitation products at high spatial (0.1°) and temporal (30-minute) resolutions, supporting weather and climate studies.",
        citation: {
            description: "IMERG data is publicly available through NASA’s Precipitation Processing System (PPS) and the GES DISC archive. Proper citation ensures recognition of data sources and supports continued data availability. To access and cite IMERG data, visit: IMERG Data Product Citation",
            link: {
                description: "IMERG Data Product Citation",
                link: "https://gpm.nasa.gov/data/directory"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) explains the processing methodology for IMERG precipitation estimates, including data fusion techniques and uncertainty assessments. The latest ATBD can be found at:",
            link: {
                description: "IMERG ATBD",
                link: "https://gpm.nasa.gov/resources/documents/imerg-v07-atbd"
            }
        },
        references: [
            {
                description: `Huffman, G.J., Bolvin, D.T., Braithwaite, D., et al. (2020). "Integrated Multi-satellite Retrievals for GPM (IMERG) Algorithm Development."`,
                link: ""    
            },
            {
                description: `Tan, J., Huffman, G.J., Adler, R.F., et al. (2019). "IMERG V06: Global Precipitation Data from the GPM Mission."`,
                link: ""    
            }
        ]
    },
    "sst": {
        id: "sst",
        title: "SPoRT SST",
        description: "The Short-term Prediction Research and Transition (SPoRT) Sea Surface Temperature (SST) product provides high-resolution sea surface temperature data derived from multiple satellite sensors, including GOES, VIIRS, and MODIS. The product is designed to support weather forecasting, tropical cyclone analysis, and oceanographic studies by offering improved spatial and temporal SST measurements compared to traditional datasets.",
        citation: {
            description: "SPoRT SST data is available through NASA's Marshall Space Flight Center and NOAA's National Centers for Environmental Information (NCEI). Proper citation ensures acknowledgment of data providers and supports continued access. For more details, visit:",
            link: {
                description: "SPoRT SST Data Product Citation",
                link: "https://weather.msfc.nasa.gov/sport/"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) for SPoRT SST explains the methodologies used for data retrieval, calibration, and atmospheric correction. It includes information on multi-sensor blending techniques to improve SST accuracy. The latest ATBD can be found at:",
            link: {
                description: "SPoRT SST ATBD",
                link: "https://weather.msfc.nasa.gov/sport/"    
            }
        },
        references: [
            {
                description: `Haines, S.L., Smith, T.M., and Jedlovec, G.J. (2014). "Advances in High-Resolution Satellite SST Data for Numerical Weather Prediction Applications."`,
                link: ""    
            },
            {
                description: `Jedlovec, G.J., Haines, S.L., and Feltz, W.F. (2016). "Validation of SPoRT SST Products for Improved Regional Weather Prediction."`,
                link: ""
            }
        ]
    },
    "cygnss": {
        id: "cygnss",
        title: "GOES-16 (2, 8, 13)",
        description: "The Cyclone Global Navigation Satellite System (CYGNSS) is a NASA mission that measures ocean surface wind speeds using GPS signals reflected off the Earth's surface. Launched in 2016, CYGNSS consists of eight small satellites providing frequent observations of tropical storms and hurricanes. The data helps improve hurricane intensity forecasting and climate studies.",
        citation: {
            description: "CYGNSS data is publicly available through NASA's Physical Oceanography Distributed Active Archive Center (PO.DAAC) and other repositories. Proper citation ensures acknowledgment of data providers and supports continued data access. CYGNSS provides Level 1 (raw delay-Doppler maps), Level 2 (ocean surface wind speed), and Level 3 (gridded wind speed and soil moisture) products. To download and cite CYGNSS data, visit",
            link: {
                description: "CYGNSS Data Product Citation",
                link: "https://podaac.jpl.nasa.gov/CYGNSS"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Document (ATBD) describes CYGNSS data processing, including calibration and wind speed retrieval algorithms. The latest ATBD can be accessed here:",
            link: {
                description: "CYGNSS ATBD",
                link: "https://archive.podaac.earthdata.nasa.gov/podaac-ops-cumulus-docs/cygnss/open/L2/docs/148-0138-6_ATBD_L2_v3.0_Wind_Speed_Retrieval.pdf"
            }
        },
        references: [
            {
                description: `Ruf, C., Unwin, M., Dickinson, J., et al. (2016). "CYGNSS: Enabling the Future of Hurricane Prediction.`,
                link: ""
            },
            {
                description: `Clarizia, M.P., Ruf, C.S. (2016). "Wind Speed Retrieval Algorithm for the CYGNSS Mission.`,
                link: ""
            }
        ]
    },
    "goes_radF_l1b_C02": {
        id: "goes_radF_l1b_C02",
        title: "GOES-16 (2, 8, 13)",
        description: "The Geostationary Operational Environmental Satellite (GOES) series provides real-time Earth observations. GOES Band 2 (0.64 µm) offers high-resolution visible imagery for cloud and surface monitoring. Band 8 (6.19 µm) detects upper-level water vapor, aiding in atmospheric dynamics analysis. Band 13 (10.3 µm) is crucial for surface temperature retrievals and cloud-top temperature estimation.",
        citation: {
            description: "GOES data, including observations from Bands 2, 8, and 13, are publicly available through NOAA’s Comprehensive Large Array-data Stewardship System (CLASS) and Amazon Web Services (AWS). Proper citation ensures acknowledgment of data sources and supports continued access. For more details, visit",
            link: {
                description: "GOES Data Product Citation",
                link: "https://www.ncdc.noaa.gov/data-access/satellite-data/goes"
            }
        },
        atbd: {
            description: "Algorithm Theoretical Basis Documents (ATBDs) describe the processing methodologies for GOES data products, including calibration and atmospheric corrections. These documents cover key aspects such as radiance calculations, cloud properties, and surface temperature estimation. A complete list of ATBDs can be found at",
            link: {
                description: "N/A",
                link: ""
            }
        },
        references: [
            {
                description: `Schmit, T.J., Gunshor, M.M., Menzel, W.P., et al. (2017). "A Closer Look at the ABI on the GOES-R Series.`,
                link: ""    
            },
            {
                description: `Pavolonis, M.J., Sieglaff, J., and Feltz, W. (2020). "Improved Satellite-Based Cloud and Moisture Observations Using GOES-16 and GOES-17.`,
                link: ""    
            }

        ]
    },
    "goes_radF_l1b_C08": {
        id: "goes_radF_l1b_C08",
        title: "GOES-16 (2, 8, 13)",
        description: "The Geostationary Operational Environmental Satellite (GOES) series provides real-time Earth observations. GOES Band 2 (0.64 µm) offers high-resolution visible imagery for cloud and surface monitoring. Band 8 (6.19 µm) detects upper-level water vapor, aiding in atmospheric dynamics analysis. Band 13 (10.3 µm) is crucial for surface temperature retrievals and cloud-top temperature estimation.",
        citation: {
            description: "GOES data, including observations from Bands 2, 8, and 13, are publicly available through NOAA’s Comprehensive Large Array-data Stewardship System (CLASS) and Amazon Web Services (AWS). Proper citation ensures acknowledgment of data sources and supports continued access. For more details, visit",
            link: {
                description: "GOES Data Product Citation",
                link: "https://www.ncdc.noaa.gov/data-access/satellite-data/goes"
            }
        },
        atbd: {
            description: "Algorithm Theoretical Basis Documents (ATBDs) describe the processing methodologies for GOES data products, including calibration and atmospheric corrections. These documents cover key aspects such as radiance calculations, cloud properties, and surface temperature estimation. A complete list of ATBDs can be found at",
            link: {
                description: "N/A",
                link: ""
            }
        },
        references: [
            {
                description: `Schmit, T.J., Gunshor, M.M., Menzel, W.P., et al. (2017). "A Closer Look at the ABI on the GOES-R Series.`,
                link: ""    
            },
            {
                description: `Pavolonis, M.J., Sieglaff, J., and Feltz, W. (2020). "Improved Satellite-Based Cloud and Moisture Observations Using GOES-16 and GOES-17.`,
                link: ""    
            }

        ]
    },
    "goes_radF_l1b_C13": {
        id: "goes_radF_l1b_C13",
        title: "GOES-16 (2, 8, 13)",
        description: "The Geostationary Operational Environmental Satellite (GOES) series provides real-time Earth observations. GOES Band 2 (0.64 µm) offers high-resolution visible imagery for cloud and surface monitoring. Band 8 (6.19 µm) detects upper-level water vapor, aiding in atmospheric dynamics analysis. Band 13 (10.3 µm) is crucial for surface temperature retrievals and cloud-top temperature estimation.",
        citation: {
            description: "GOES data, including observations from Bands 2, 8, and 13, are publicly available through NOAA’s Comprehensive Large Array-data Stewardship System (CLASS) and Amazon Web Services (AWS). Proper citation ensures acknowledgment of data sources and supports continued access. For more details, visit",
            link: {
                description: "GOES Data Product Citation",
                link: "https://www.ncdc.noaa.gov/data-access/satellite-data/goes"
            }
        },
        atbd: {
            description: "Algorithm Theoretical Basis Documents (ATBDs) describe the processing methodologies for GOES data products, including calibration and atmospheric corrections. These documents cover key aspects such as radiance calculations, cloud properties, and surface temperature estimation. A complete list of ATBDs can be found at",
            link: {
                description: "N/A",
                link: ""
            }
        },
        references: [
            {
                description: `Schmit, T.J., Gunshor, M.M., Menzel, W.P., et al. (2017). "A Closer Look at the ABI on the GOES-R Series.`,
                link: ""    
            },
            {
                description: `Pavolonis, M.J., Sieglaff, J., and Feltz, W. (2020). "Improved Satellite-Based Cloud and Moisture Observations Using GOES-16 and GOES-17.`,
                link: ""    
            }

        ]
    },
    "modis_mosaic": {
        id: "modis_mosaic",
        title: "GOES-16 (2, 8, 13)",
        description: "The Moderate Resolution Imaging Spectroradiometer (MODIS) aboard NASA’s Terra and Aqua satellites captures data in 36 spectral bands (0.4–14.4 µm) at 250 m to 1 km resolution. MODIS provides near-daily global coverage, supporting land, ocean, and atmospheric studies. Band 31 (10.78–11.28 µm) is crucial for surface temperature retrievals.",
        citation: {
            description: "For accessing and citing the MODIS Level 1B Calibrated Radiances at 1 km resolution (product MYD021KM), please visit the following link",
            link: {
                description: "MYD021KM Data Product Citation",
                link: "https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD021KM#overview"
            }
        },
        atbd: {
            description: "Algorithm Theoretical Basis Documents (ATBDs) provide detailed descriptions of the algorithms used to process MODIS data products. For a comprehensive list of MODIS ATBDs, including those related to land, ocean, and atmospheric products, refer to NASA's Earth Observing System page",
            link: {
                description: "NASA MODIS ATBDs",
                link: "https://eospso.nasa.gov/atbd-category/47"
            }
        },
        references: [
            {
                description: `King, M.D., Tsay, S.C., Platnick, S., Wang, M., Liou, K.N. (1998). "Cloud Retrieval Algorithms for MODIS: Optical Thickness, Effective Particle Radius, and Thermodynamic Phase.`,
                link: ""    
            },
            {
                description: `Seemann, S.W., Borbas, E.E., Li, J., Menzel, W.P., Gumley, L.E. (2006). "MODIS Atmospheric Profile Retrieval – ATBD (Collection 005).`,
                link: ""
            }
        ]
    },
    "viirs_mosaic": {
        id: "viirs_mosaic",
        title: "GOES-16 (2, 8, 13)",
        description: "The Visible Infrared Imaging Radiometer Suite (VIIRS) aboard the Suomi NPP and NOAA-20 satellites provides Earth observations in 22 spectral bands. VIIRS Band I5 (10.60–12.40 µm) is critical for surface temperature retrievals, cloud detection, and fire monitoring. With a 375 m resolution, it enhances atmospheric and land surface studies with high spatial detail.",
        citation: {
            description: "For accessing and citing the VIIRS data, including Band I5 observations, visit the following link",
            link: {
                description: "VIIRS Data Product Citation",
                link: "https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/VNP02MOD"
            }
        },
        atbd: {
            description: "The Algorithm Theoretical Basis Documents (ATBDs) detail the methods used for processing VIIRS data. For a comprehensive list, refer to",
            link: {
                description: "ref",
                link: "https://ladsweb.modaps.eosdis.nasa.gov/api/v2/content/archives/Document%20Archive/Science%20Data%20Product%20Documentation/Product%20Generation%20Algorithms/NASARevisedVIIRSGeolocationATBD2014.pdf"
            }
        },
        references: [
            {
                description: `Cao, C., Xiong, X., Wu, A., and Uprety, S. (2013). "VIIRS on Suomi NPP Calibration, Characterization, and Performance.`,
                link: ""
            },
            {
                description: `Yu, F., Bennartz, R., Greenwald, T., and Huang, B. (2016). "Cloud Property Retrievals from Suomi-NPP VIIRS.`,
                link: ""
            }
        ]
    },
    "public.path_point": {
        id: "public.path_point",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
        citation: {
            description: "NA",
            link: {
                description: "NA",
                link: ""
            }
        },
        atbd: {
            description: "NA",
            link: {
                description: "NA",
                link: ""    
            }
        },
        references: [
            {
                description: "NA",
                link: ""    
            }
        ]
    },
    "public.path_line": {
        id: "public.path_line",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
        citation: {
            description: "NA",
            link: {
                description: "NA",
                link: ""
            }
        },
        atbd: {
            description: "NA",
            link: {
                description: "NA",
                link: ""    
            }
        },
        references: [
            {
                description: "NA",
                link: ""    
            }
        ]
    },
    "public.wind_polygon": {
        id: "public.wind_polygon",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
        citation: {
            description: "NA",
            link: {
                description: "NA",
                link: ""
            }
        },
        atbd: {
            description: "NA",
            link: {
                description: "NA",
                link: ""    
            }
        },
        references: [
            {
                description: "NA",
                link: ""    
            }
        ]
    },
    "public.wind_vectors": {
        id: "public.wind_vectors",
        title: "GOES-16 (2, 8, 13)",
        description: "The GOES-16 satellite provides real-time, high-resolution imagery and atmospheric data, critical for weather monitoring and forecasting. Bands 2 (visible), 8 (infrared), and 13 (longwave infrared) offer vital insights into cloud formation, temperature, and storm dynamics.",
        citation: {
            description: "NA",
            link: {
                description: "NA",
                link: ""
            }
        },
        atbd: {
            description: "NA",
            link: {
                description: "NA",
                link: ""    
            }
        },
        references: [
            {
                description: "NA",
                link: ""    
            }
        ]
    },
    "public.modis_swath": {
        id: "public.modis_swath",
        title: "GOES-16 (2, 8, 13)",
        description: "The Moderate Resolution Imaging Spectroradiometer (MODIS) aboard NASA’s Terra and Aqua satellites captures data in 36 spectral bands (0.4–14.4 µm) at 250 m to 1 km resolution. MODIS provides near-daily global coverage, supporting land, ocean, and atmospheric studies. Band 31 (10.78–11.28 µm) is crucial for surface temperature retrievals.",
        citation: {
            description: "For accessing and citing the MODIS Level 1B Calibrated Radiances at 1 km resolution (product MYD021KM), please visit the following link",
            link: {
                description: "MYD021KM Data Product Citation",
                link: "https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD021KM#overview"
            }
        },
        atbd: {
            description: "Algorithm Theoretical Basis Documents (ATBDs) provide detailed descriptions of the algorithms used to process MODIS data products. For a comprehensive list of MODIS ATBDs, including those related to land, ocean, and atmospheric products, refer to NASA's Earth Observing System page",
            link: {
                description: "NASA MODIS ATBDs",
                link: "https://eospso.nasa.gov/atbd-category/47"
            }
        },
        references: [
            {
                description: `King, M.D., Tsay, S.C., Platnick, S., Wang, M., Liou, K.N. (1998). "Cloud Retrieval Algorithms for MODIS: Optical Thickness, Effective Particle Radius, and Thermodynamic Phase.`,
                link: ""    
            },
            {
                description: `Seemann, S.W., Borbas, E.E., Li, J., Menzel, W.P., Gumley, L.E. (2006). "MODIS Atmospheric Profile Retrieval – ATBD (Collection 005).`,
                link: ""
            }
        ]
    }
}
