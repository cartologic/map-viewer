import React, { useState, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from "@material-ui/icons/Menu";
import PrintIcon from "@material-ui/icons/Print";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from '@material-ui/icons/Add'
import MenuItem from '@material-ui/core/MenuItem';

import { BasicViewerContext } from '../context';
import SaveDialog from './SaveDialog';
import AddLayers from './AddLayersDialog';


function SimpleMenu() {
    let context = useContext(BasicViewerContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const [saveMapOpen, setSaveMapOpen] = useState(false)
    const [addLayersOpen, setAddLayersOpen] = useState(false)
    const [component, setComponent] = useState(null)

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <Button
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                onClick={handleClick}>
                <MenuIcon />
            </Button>
            <Menu id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                style={{ top: "7px", left: "-7px" }}>

                <MenuItem onClick={() => setSaveMapOpen(true)} >
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Save Map" />
                </MenuItem>

                <MenuItem onClick={() => setAddLayersOpen(true)}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Layers" />
                </MenuItem>

                <MenuItem onClick={() => context.exportMap()}>
                    <ListItemIcon>
                        <PrintIcon />
                    </ListItemIcon>
                    <ListItemText primary="Export Map" />
                </MenuItem>

            </Menu>
            <SaveDialog open={saveMapOpen} handleClose={() => setSaveMapOpen(false)} />
            <AddLayers open={addLayersOpen} handleClose={() => setAddLayersOpen(false)} />

        </div>
    );
}

export default SimpleMenu;