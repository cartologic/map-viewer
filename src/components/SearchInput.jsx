import IconButton from '@material-ui/core/IconButton'
import InputBase from '@material-ui/core/InputBase'
import MenuIcon from '@material-ui/icons/Menu'
import Paper from '@material-ui/core/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: '100%',
	},
	input: {
		marginLeft: 8,
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4,
	},
});

function GoogleLikeInput(props) {
	const { classes, menuClickHandle } = props;

	return (
		<Paper className={classes.root} elevation={1}>
			<IconButton onClick={menuClickHandle} className={classes.iconButton} aria-label="Menu">
				<MenuIcon />
			</IconButton>
			<InputBase className={classes.input} placeholder="Search For Location" />
			<IconButton className={classes.iconButton} aria-label="Search">
				<SearchIcon />
			</IconButton>
		</Paper>
	);
}

GoogleLikeInput.propTypes = {
	classes: PropTypes.object.isRequired,
	menuClickHandle: PropTypes.func.isRequired,
};

export default withStyles(styles)(GoogleLikeInput);