import ReactDOM from "react-dom/client";
import { IconButton } from "@mui/material";
import RestoreIcon from '@mui/icons-material/Restore';
import Tooltip from '@mui/material/Tooltip';

const Restore = ({onClickHandler}) => {
    return (
        <Tooltip title="Restore Previous Region">
            <IconButton className="menu-open-icon" onClick={onClickHandler}>
                <RestoreIcon className="map-control-icon"/>
            </IconButton>
        </Tooltip>
    )
}

export class RestoreControl {
    constructor(handleRefresh) {
        this.root = null;
        this._map = null;
        this._onClick = handleRefresh;
    }

    onAdd = (map) => {
        this._map = map;
        this._container = document.createElement('div');
        this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        const root = ReactDOM.createRoot(this._container);
        root.render(<Restore onClickHandler={this._onClick}/>);
        this.root = root;
        return this._container;
    }

    onRemove = () => {
        setTimeout(() => {
            try {
                this.root.unmount();
                this._container.parentNode.removeChild(this._container);
                this._map = null;
            } catch (err) {
                console.warn("Error during cleanup:", err);
            }
        }, 0);
    }
}
