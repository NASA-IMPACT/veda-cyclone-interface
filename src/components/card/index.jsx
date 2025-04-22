import { useEffect, useState } from 'react';
import moment from "moment";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import styled from "styled-components";
import Divider from '@mui/material/Divider';
import DownloadIcon from '@mui/icons-material/Download';
import { ColorBar } from '../colorBar';
import { ScatterometerLegend, BestTrackPointLegend, BestTrackLineLegend, WindSwathLegend } from './helper';
import { ColormapOptions } from "../configurableColorBar"
import { ConfigurableColorBar } from "../configurableColorBar";

import "./index.css";

const HorizontalLayout = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    margin-bottom: 5px;
`;

const HighlightableCard = styled(Card)
`
    transition: border 0.3s ease;
    &:hover {
        border: 1px solid blue;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    border: ${props => props.$isHovered ? "1px solid blue" : "1px solid transparent"};
    box-shadow: ${props => props.$isHovered ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "none"};
`;

const CaptionValue = ({ caption, value, className }) => {
    return (
        <div className={className}>
            <Typography
                variant="body1"
                component="div"
                sx={{ color: 'text.primary' }}
            >
                { caption }
            </Typography>
            <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary' }}
            >
                { value }
            </Typography>
        </div>
    )
}

const formatDuration = (duration) => {
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let result = "";
    if ( hours > 0 ) result += `${hours} hour `;
    if ( minutes > 0 ) result += `${minutes} minutes `;
    if ( seconds > 0 ) result += `${seconds} seconds`;

    return result;
}

export function PlumeCard({ id, title, description, VMIN, VMAX, colorMap, skipColorBar=false }) {
    return (
        <HighlightableCard
            sx={{ display: 'flex', flex: '0 0 auto', margin: '15px' }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <HorizontalLayout>
                    <CaptionValue
                        caption = {String(title)}
                        value = {description}
                    />
                </HorizontalLayout>
                {(!skipColorBar) &&<HorizontalLayout>
                    <div>
                        <ColorBar VMIN={VMIN} VMAX={VMAX} STEP={(VMAX-VMIN)/5} colorMap={colorMap}/>
                    </div>
                </HorizontalLayout>
                }
            </CardContent>
            </Box>
        </HighlightableCard>

  );
}

export function DetailedPlumeCard({ id, title, description, citation, atbd, references, VMIN, VMAX, colorMap, skipColorBar=false }) {
    const isVector = String(id).includes("public.")
    return (
        <HighlightableCard
            sx={{ display: 'flex', flex: '0 0 auto', margin: '15px' }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <HorizontalLayout>
                    <CaptionValue
                        caption = {String(title)}
                        value = {description}
                    />
                </HorizontalLayout>
                <HorizontalLayout>
                    <CaptionValue
                        caption = {String("Data Product Citation")}
                        value = {<div>{citation.description}: <a href={citation?.link?.link} target="_blank" rel="noreferrer">{citation?.link?.description}</a></div>}
                    />
                </HorizontalLayout>
                <HorizontalLayout>
                    <CaptionValue
                        caption = {String("ATBD Document")}
                        value = {<div>{atbd.description}: <a href={atbd?.link?.link} target="_blank" rel="noreferrer">{atbd?.link?.description}</a></div>}
                    />
                </HorizontalLayout>
                <HorizontalLayout>
                    <CaptionValue
                        caption = {String("References")}
                    />
                </HorizontalLayout>
                {
                    references?.length && references.map((reference, index) => {
                        return (
                                <Typography variant="body2" gutterBottom sx={{ display: 'block', color: "rgba(0, 0, 0, 0.6)" }}>
                                    {index+1}. {reference?.description}
                                </Typography>
                        )
                    })
                }
                 <HorizontalLayout/>
                {isVector ?
                    <GetVectorColorBar id={id}/> :
                    <HorizontalLayout>
                        <ConfigurableColorBar VMIN={VMIN} VMAX={VMAX} colorMap={colorMap}/>
                    </HorizontalLayout>
                }
            </CardContent>
            </Box>
        </HighlightableCard>
  );
}

function GetVectorColorBar({id}) {
    // TODO: later handle this based on data model of the dataTree.
    if (id === "public.path_point_cyclone_beryl") {
        return <BestTrackPointLegend/>
    }
    if (id === "public.path_line_cyclone_beryl") {
        return <BestTrackLineLegend/>
    }
    if (id === "public.wind_polygon_cyclone_beryl") {
        return <WindSwathLegend/>
    }
    if (id === "public.wind_vectors_cyclone_beryl") {
        // 
        return <ScatterometerLegend/>

    }
    return <></>
}
