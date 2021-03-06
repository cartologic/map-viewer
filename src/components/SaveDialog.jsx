import { FileUpload, Loader } from './CommonComponents'

import { BasicViewerContext } from '../context'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import PropTypes from 'prop-types'
import React from 'react'
import TextField from '@material-ui/core/TextField'
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
		margin: theme.spacing()
	}
})
class SaveDialog extends React.Component {
	handleChange = name => event => {
		const { currentMap, setStateKey } = this.context
		let map = currentMap ? currentMap : {}
		let value = event.target.value
		if (name === "keywords") {
			value = value.split(',')
		}
		setStateKey('currentMap', { ...map, [name]: value })
	};
	handleFileChange = file => {
		const { currentMap, setStateKey } = this.context
		let map = currentMap ? currentMap : {}
		setStateKey('currentMap', { ...map, featured_image: file })
	};
	render() {
		const { handleClose, open, classes } = this.props
		const { currentMap, saveMap, mapSaving } = this.context
		return (
			<div>
				<Dialog
					open={open}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
				>
					<DialogTitle id="form-dialog-title">{"Save Map"}</DialogTitle>
					<DialogContent>
						<TextField
							id="outlined-name"
							label="Title"
							className={classes.textField}
							fullWidth
							value={currentMap.title}
							onChange={this.handleChange('title')}
							margin="normal"
							variant="outlined"
						/>
						<TextField
							id="outlined-name"
							label="Abstract"
							fullWidth
							className={classes.textField}
							value={currentMap.abstract}
							onChange={this.handleChange('abstract')}
							margin="normal"
							variant="outlined"
						/>
						<TextField
							id="outlined-name"
							label="Keywords"
							fullWidth
							className={classes.textField}
							value={currentMap.keywords.join(',')}
							onChange={this.handleChange('keywords')}
							margin="normal"
							helperText="A comma-separated list of tags."
							variant="outlined"
						/>
						<TextField
							id="outlined-name"
							label="Description"
							fullWidth
							multiline
							rows="5"
							className={classes.textField}
							value={currentMap.description}
							onChange={this.handleChange('description')}
							margin="normal"
							variant="outlined"
						/>
						<FileUpload handleFiles={(files) => this.handleFileChange(files[0])} accept={'image/png'} label="Drop Your Featured Image Here" />
					</DialogContent>
					<DialogActions>
						<Button disabled={mapSaving} onClick={handleClose} color="primary">
							{"Cancel"}
						</Button>
						<Button disabled={mapSaving} onClick={saveMap} color="primary">
							{mapSaving && <Loader size={20} />}
							{"Save"}
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		)
	}
}
SaveDialog.contextType = BasicViewerContext
SaveDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	handleClose: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
}
SaveDialog.defaultProps = {
	handleClose: function () {

	},
	open: false,
}
export default withStyles(styles)(SaveDialog)