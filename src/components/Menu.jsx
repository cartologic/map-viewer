import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from "@material-ui/icons/Menu";
import PrintIcon from "@material-ui/icons/Print";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from '@material-ui/icons/Add';
import LayersIcon from '@material-ui/icons/Layers';
import ImageIcon from '@material-ui/icons/Image'

import { BasicViewerContext } from '../context';
import SaveDialog from './SaveDialog';
import AddLayersDialog from './AddLayersDialog';
import LayersDrawer from './LayersDrawer';
import LegendsDrawer from './LegendsDrawer';

const useStyles = makeStyles({
    iconButton: {
        marginLeft: "1em",
    }
});

function SimpleMenu() {

    const classes = useStyles();
    let context = useContext(BasicViewerContext)
    const [anchorEl, setAnchorEl] = useState(null);
    const [saveMapOpen, setSaveMapOpen] = useState(false)
    const [addLayersOpen, setAddLayersOpen] = useState(false)
    const [layersDrawerOpen, setLayersDrawerOpen] = useState(false)
    const [legendsDrawerOpen, setLegendsDrawerOpen] = useState(false)

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMenuClose() {
        setAnchorEl(null);
    }

    return (
        <div>
            <IconButton
                aria-owns={anchorEl ? 'simple-menu' : undefined}
                aria-haspopup="true"
                className={classes.iconButton}
                onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu id="simple-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                style={{ top: "4px", left: "-26px" }}>

                <MenuItem onClick={() => { setSaveMapOpen(true); handleMenuClose() }}>
                    <ListItemIcon>
                        <SaveIcon />
                    </ListItemIcon>
                    <ListItemText primary="Save Map" />
                </MenuItem>

                <MenuItem onClick={() => { setAddLayersOpen(true); handleMenuClose() }}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add Layers" />
                </MenuItem>

                <MenuItem onClick={() => { setLayersDrawerOpen(true); handleMenuClose() }}>
                    <ListItemIcon>
                        <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary="Layers" />
                </MenuItem>

                <MenuItem onClick={() => { setLegendsDrawerOpen(true); handleMenuClose() }}>
                    <ListItemIcon>
                        <ImageIcon />
                    </ListItemIcon>
                    <ListItemText primary="Legend" />
                </MenuItem>

                <MenuItem onClick={() => { context.exportMap(); handleMenuClose() }}>
                    <ListItemIcon>
                        <PrintIcon />
                    </ListItemIcon>
                    <ListItemText primary="Export Map" />
                </MenuItem>
            </Menu>
            <SaveDialog open={saveMapOpen} handleClose={() => setSaveMapOpen(false)} />
            <AddLayersDialog open={addLayersOpen} handleClose={() => setAddLayersOpen(false)} />
            <LayersDrawer open={layersDrawerOpen} handleClose={() => setLayersDrawerOpen(false)} />
            <LegendsDrawer open={legendsDrawerOpen} handleClose={() => setLegendsDrawerOpen(false)} />
        </div >
    );
}

export default SimpleMenu;