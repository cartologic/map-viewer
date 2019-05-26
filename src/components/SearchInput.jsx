import React from "react"
import IconButton from "@material-ui/core/IconButton"
import InputBase from "@material-ui/core/InputBase"
import Paper from "@material-ui/core/Paper"
import PropTypes from "prop-types"
import SearchIcon from "@material-ui/icons/Search"
import { withStyles } from "@material-ui/core/styles"

import Menu from "./Menu";

const styles = theme => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
})

function SearchInput(props) {
  const { classes } = props

  return (
    <Paper className={classes.root} elevation={1}>
      <Menu />
      <InputBase className={classes.input} placeholder="Search For Location" />
      <IconButton className={classes.iconButton} aria-label="Search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

SearchInput.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SearchInput)
