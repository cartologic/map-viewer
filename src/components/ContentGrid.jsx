import { CartoviewSnackBar, CustomizedSnackBar } from './CommonComponents'
import React, { Component } from 'react'

import { BasicViewerContext } from '../context'
import CartoviewDrawer from './Drawer'
import CartoviewPopup from './Popup'
import GoogleLikeInput from './SearchInput'
import Grid from '@material-ui/core/Grid'
import MapViewer from './MapViewer'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import Slide from '@material-ui/core/Slide'
import classnames from "classnames"
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

const styles = theme => ({
	root: {
		height: "100%"
	},
	drawer: {
		width: "30%",
		height: "100%",
		zIndex: "1150",
		position: "fixed",
		[theme.breakpoints.down('sm')]: {
			width: "90%"
		},
	},
	drawerClose: {
		width: "0%",
		height: "100%",
		zIndex: "1150",
		position: "fixed"
	},
	drawerContentClose: {
		display: 'none'
	},
	drawerContainer: {
		left: "0px !important"
	},
	DrawerBar: {
		width: '28%',
		zIndex: '12',
		display: 'flex',
		flexDirection: 'column',
		position: 'fixed',
		top: '1%',
		[theme.breakpoints.down('md')]: {
			width: '28%',
			top: ".5%"
		},
		[theme.breakpoints.down('sm')]: {
			width: "88%",
			top: ".5%"
		},
		left: '1%',
	},
	DrawerOpenBar: {
		width: '95% !important',
		zIndex: '12',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: '1%',
		[theme.breakpoints.down('sm')]: {
			width: "95% !important",
			top: ".5%"
		},
		left: '1.5%',
	}
})

function Transition(props) {
	return <Slide direction="left" {...props} />
}
class ContentGrid extends Component {
	render() {
		const { drawerOpen, toggleDrawer, mapSaving, mapSavingMessage, setStateKey } = this.context
		const { classes } = this.props
		return (
			<div className={classes.root}>
				<div className={classnames({ [classes.drawer]: drawerOpen ? true : false, [classes.drawerClose]: drawerOpen ? false : true })}>
					<Paper className={classnames(classes.DrawerBar, { [classes.DrawerOpenBar]: drawerOpen })}>
						{/* <div className="element-flex ">
							<IconButton onClick={toggleDrawer} color="default" aria-label="Open Menu">
								<MenuIcon />
							</IconButton>
						</div> */}
						<GoogleLikeInput menuClickHandle={toggleDrawer} />
						{/* {!childrenProps.geocodeSearchLoading && childrenProps.geocodingResult.length > 0 &&
									<GeoCodeResult
										resetGeocoding={childrenProps.resetGeocoding}
										action={childrenProps.zoomToExtent}
										geocodingResult={childrenProps.geocodingResult}
										geocodeSearchLoading={childrenProps.geocodeSearchLoading}
										boundlessGeoCodingEnabled={childrenProps.config.boundlessGeoCodingEnabled}
									/>} */}
					</Paper>
					<Transition in={drawerOpen} direction={"right"}>
						<CartoviewDrawer className={classnames({ [classes.drawerContentClose]: !drawerOpen })} />
					</Transition>
				</div>
				<Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
					<Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
						<MapViewer />
						<CartoviewPopup />
					</Grid>
				</Grid>
				<CartoviewSnackBar />
				<CustomizedSnackBar
					open={(!mapSaving && mapSavingMessage !== null)}
					message={mapSavingMessage}
					variant="info"
					handleClose={() => setStateKey('mapSavingMessage', null)}
				/>
			</div>
		)
	}
}
ContentGrid.contextType = BasicViewerContext
ContentGrid.propTypes = {
	classes: PropTypes.object.isRequired,
	width: PropTypes.string,
}
export default compose(withStyles(styles), withWidth())(ContentGrid)