import { styled as styledmui } from '@mui/material/styles';
import styled from "styled-components";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import { PlumeCard, DetailedPlumeCard } from '../card';
import { useEffect, useState } from 'react';

import "./index.css";

import { CycloneMetas as cycloneMetasOverride } from "../../assets/dataset/metadata";

const drawerWidth = "30rem";

const Main = styledmui('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    /**
     * This is necessary to enable the selection of content. In the DOM, the stacking order is determined
     * by the order of appearance. Following this rule, elements appearing later in the markup will overlay
     * those that appear earlier. Since the Drawer comes after the Main content, this adjustment ensures
     * proper interaction with the underlying content.
     */
    position: 'relative',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginRight: 0,
        },
      },
    ],
  }),
);

const DrawerHeader = styledmui('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

export function PersistentDrawerRight({open, selectedCycloneId, dataTree, selectedDataProductIds, dataProductsTemp, dataProductBasedColorMap, setDataProductBasedColorMap}) {
  const [ cycloneMetas, setCycloneMetas] = useState([]);
  useEffect(() => {
    if (!dataTree.current || !selectedCycloneId || !dataTree.current[selectedCycloneId]) return;

    const dataProducts = dataTree.current[selectedCycloneId].dataProducts;
    const selectedDataProductIdsSet = new Set(selectedDataProductIds)
    const metas = Object.keys(dataProducts).map((key) => {
      if (!selectedDataProductIdsSet.has(key)) return null;
      const dp = dataProducts[key]

      const mapRev = {}; // todo: handle this in data transformation, i.e. putting fullName to dataTree
      Object.keys(dataProductsTemp).map(key => {
        mapRev[`${dataProductsTemp[key].id}`]= dataProductsTemp[key]
      });

      if (dp.type === "Vector") return {
        title: mapRev[dp.name].fullName, // todo: handle this in data transformation, i.e. putting fullName to dataTree
        description: dp.description,
        id: dp.id,
        colorMap: "rdylgn",
        rescale: [0, 5],
        key: key // TODO: remove later if not needed
      };

      return {
        // title: dp.name,
        title: mapRev[dp.name].fullName, // todo: handle this in data transformation, i.e. putting fullName to dataTree
        description: dp.description,
        id: dp.id,
        colorMap: dp.colormap,
        rescale: dp.rescale[0],
        key: key, // TODO: remove later if not needed
        units: dp.units
      }
    }).filter(el => el);
    setCycloneMetas(metas)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTree, dataTree.current, selectedCycloneId, selectedDataProductIds]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Main open={open}>
        <DrawerHeader />
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          marginRight: "5px",
          marginTop: "5px",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            marginRight: "5px",
            marginTop: "5px",
            // height: 'calc(100vh - var(--colorbar-height) - 3.5%)', //colobar is up 3% from bottom
            height: 'calc(100vh - 3.5%)', // 3% up from bottom
            borderRadius: '3px',
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader className="drawer-head">
          <HorizontalLayout>
            <Typography
                  variant="h6"
                  component="div"
                  fontWeight="bold"
                  className='drawer-head-content'
            >
              Cyclone Observations
            </Typography>
          </HorizontalLayout>
        </DrawerHeader>
          { !!cycloneMetas.length &&
            cycloneMetas.map(cycloneMeta => (
              <DetailedPlumeCard
                id={cycloneMeta.id}
                key={cycloneMeta.id}
                title={cycloneMeta.title}
                description={cycloneMetasOverride[cycloneMeta["key"]].description}
                citation={cycloneMetasOverride[cycloneMeta["key"]].citation}
                atbd={cycloneMetasOverride[cycloneMeta["key"]].atbd}
                references={cycloneMetasOverride[cycloneMeta["key"]].references}
                colorMap={cycloneMeta.colorMap}
                VMIN={cycloneMeta.rescale[0]}
                VMAX={cycloneMeta.rescale[1]}
                units={cycloneMeta.units}
                dataProductBasedColorMap={dataProductBasedColorMap}
                setDataProductBasedColorMap={setDataProductBasedColorMap}
              />
              // <PlumeCard
              //   key={cycloneMeta.id}
              //   title={cycloneMeta.title}
              //   description={cycloneMeta.description}
              //   colorMap={cycloneMeta.colorMap}
              //   VMIN={cycloneMeta.rescale[0]}
              //   VMAX={cycloneMeta.rescale[1]}
              // />
            ))
          }
          <PlumeCard
            key={"beryl"}
            title={"About the Cyclone"}
            description={"Hurricane Beryl was an extremely powerful hurricane that occurred in the Northern Atlantic Ocean in June and July of 2024. Beryl rapidly intensified to a Category 4 hurricane as it approached the Lesser Antilles, making landfall on Grenada’s Carriacou Island and causing significant damage. Once Beryl made its way into the Caribbean Sea, it reached Category 5 status - the highest rating on the Saffir-Simpson scale. The storm did not make any more landfalls until it weakened in the western Caribbean and struck Mexico’s Yucatan Peninsula as a Category 2. It then moved into the Gulf of Mexico and made one final landfall near Matagorda, Texas as a Category 1 hurricane and moved over the Houston metro area before dissipating. Beryl was the strongest hurricane ever observed in the Atlantic Ocean before July 4th since records began in 1851, with peak sustained winds estimated at 165 mph. Beryl was also the first Atlantic hurricane on record to reach Category 4 strength or higher during the month of June and just the second Category 5 hurricane to occur during the month of July. Beryl inflicted 71 direct fatalities and was responsible for over $8 Billion USD in damages. "}
            skipColorBar={true}
          />
      </Drawer>
    </Box>
  );
}
