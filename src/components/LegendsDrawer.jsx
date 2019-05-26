import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import Legends from './Legend';


const styles = theme => ({
    list: {
        width: 350,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }
});

class LegendsDrawer extends React.Component {

    render() {

        return (
            <Drawer
                open={this.props.open}
                onClose={this.props.handleClose}
                variant="persistent">

                <div className={this.props.classes.drawerHeader}>
                    <IconButton onClick={this.props.handleClose}>
                        {this.props.theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />

                <div tabIndex={0} role="button">
                    <div className={this.props.classes.list}>
                        <Legends/>
                    </div>
                </div>
            </Drawer>
        );
    }
}

LegendsDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(LegendsDrawer);