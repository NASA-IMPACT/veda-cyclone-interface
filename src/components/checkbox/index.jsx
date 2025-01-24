import { useState, useRef, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Slider from '@mui/material/Slider';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export function DatasetCheckbox({ dataProducts, setSelectedDataProductIds, handleSelectedDatasetForAnimation }) {
    const [checked, setChecked] = useState([]);

    const handleToggle = (value) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
      setSelectedDataProductIds(newChecked);
    };

    return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {Object.keys(dataProducts).map((dataProduct) => {
            const name = dataProducts[dataProduct].name;
            const id = dataProducts[dataProduct].id;
            const labelId = `checkbox-list-label-${id}`;

            return (
            <ListItem
                key={labelId}
                disablePadding
            >
                <ListItemButton role={undefined} onClick={handleToggle(id)} dense>
                    <ListItemIcon>
                        <Checkbox
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            edge="start"
                            checked={checked.includes(id)}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText sx={{width: "50%"}} id={labelId} primary={name} />
                        <PlayArrowIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSelectedDatasetForAnimation(id);
                            }}
                            sx={{width: "20%"}}
                        />
                        <Slider
                            onClick={(e) => e.stopPropagation()}
                            sx={{width: "30%"}}
                            defaultValue={100}
                            aria-label="Disabled slider"
                        />
                </ListItemButton>
            </ListItem>
            );
        })}
    </List>
    );
}
