import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import classnames from "classnames"
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

import { CartoviewSnackBar, CustomizedSnackBar } from './CommonComponents'
import MapViewer from './MapViewer'
import { BasicViewerContext } from '../context'
import CartoviewPopup from './Popup'
import GoogleLikeInput from './SearchInput'


const styles = theme => ({
	root: {
		height: "100%"
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
			width: "68%",
			top: ".5%"
		},
		left: '1%',
	},
})

class ContentGrid extends Component {
	render() {
		const { mapSaving, mapSavingMessage, setStateKey } = this.context
		const { classes } = this.props
		return (
			<div className={classes.root}>
				<div className={classes.DrawerBar}>
					<Paper >
						<GoogleLikeInput />
					</Paper>
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
}
export default withStyles(styles)(ContentGrid);