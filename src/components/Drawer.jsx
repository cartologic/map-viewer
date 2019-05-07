import React, { useState } from 'react'

import AddIcon from '@material-ui/icons/Add'
import AddLayers from './AddLayers'
import BarChartIcon from '@material-ui/icons/BarChart'
import CartoviewLayerSwitcher from './LayerSwitcher'
import CartoviewLegends from './Legend'
import CollapsibleListItem from './CollapsibleItem'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ImageIcon from '@material-ui/icons/Image'
import LayersIcons from '@material-ui/icons/Layers'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MapIcon from '@material-ui/icons/Map'
import MapRoundedIcon from '@material-ui/icons/MapRounded'
import NavBar from './Navbar.jsx'
import Paper from '@material-ui/core/Paper'
import PrintIcon from '@material-ui/icons/Print'
import PropTypes from 'prop-types'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import SaveDialog from './SaveDialog'
import SaveIcon from '@material-ui/icons/Save'
import TextField from '@material-ui/core/TextField';
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
	root: {
		height: "100%",
	},
	drawerPaper: {
		padding: 0,
		height: "calc(100% - 64px)",
		overflowY: 'scroll',
	},
	button: {
		margin: theme.spacing.unit,
	},
	baseMaps: {
		display: 'flex',
		margin: '20px'
	}
})

const CartoviewDrawer = (props) => {
	const {
		classes, className
	} = props
	const [component, setComponent] = useState(null)
	const [saveMapOpen, setSaveMapOpen] = useState(false)
	return (
		<Paper elevation={6} className={classnames(classes.root, className)}>
			<NavBar />
			<Paper className={classes.drawerPaper} elevation={0}>
				{!component && <List disablePadding={true}>
					<ListItem button onClick={() => setSaveMapOpen(true)}>
						<ListItemIcon>
							<SaveIcon />
						</ListItemIcon>
						<ListItemText primary="Save Map" />
					</ListItem>
					<ListItem onClick={() => setComponent('AddLayers')} button>
						<ListItemIcon>
							<AddIcon />
						</ListItemIcon>
						<ListItemText primary="Add Layers" />
					</ListItem>
					<CollapsibleListItem open={false} title="Layers" icon={<LayersIcons />}>
						<CartoviewLayerSwitcher />
					</CollapsibleListItem>
					<CollapsibleListItem open={false} title="Legend" icon={<ImageIcon />}>
						<CartoviewLegends />
					</CollapsibleListItem>
					{/* <ListItem button onClick={() => { }}>
						<ListItemIcon>
							<PrintIcon />
						</ListItemIcon>
						<ListItemText primary="Print" />
					</ListItem> */}
				</List>}
				{component == "AddLayers" && <AddLayers setComponent={setComponent} />}
			</Paper>
			<SaveDialog open={saveMapOpen} handleClose={() => setSaveMapOpen(false)} />
		</Paper>
	)
}

CartoviewDrawer.propTypes = {
	classes: PropTypes.object.isRequired,
	className: PropTypes.string.isRequired,
}
export default withStyles(styles)(CartoviewDrawer)