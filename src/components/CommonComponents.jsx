import React, { useContext } from 'react'

import { BasicViewerContext } from '../context'
import CircularProgress from '@material-ui/core/CircularProgress'
import LinearProgress from '@material-ui/core/LinearProgress'
import MySnackbarContentWrapper from './SnackBarContent'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Typography from '@material-ui/core/Typography'
import { useDropzone } from 'react-dropzone';

export const Loader = (props) => {
    const { size, thickness, align, type } = props
    return (
        <div className={`text-${align || "center"}`} >
            {(typeof (type) === "undefined" || type === "circle") && <CircularProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></CircularProgress>}
            {type === "line" && <LinearProgress size={size ? size : 50} thickness={thickness ? thickness : 5} className="text-center"></LinearProgress>}
        </div>
    )
}
Loader.propTypes = {
    size: PropTypes.number,
    thickness: PropTypes.number,
    align: PropTypes.string,
    type: PropTypes.string
}
export const Message = (props) => {
    const { align, type, message, color, noWrap } = props
    return <Typography variant={type} align={align ? align : "center"} noWrap={typeof (noWrap) !== "undefined" ? noWrap : message.length > 70 ? true : false} color={color ? color : "inherit"} className="element-flex">{message}</Typography>
}
Message.propTypes = {
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    align: PropTypes.string,
    color: PropTypes.string,
    noWrap: PropTypes.bool,
}
const SnackMessage = (props) => {
    const { message } = props
    return <span className="element-flex" id="message-id"><Loader size={20} thickness={4} /> {message} </span>
}
SnackMessage.propTypes = {
    message: PropTypes.string.isRequired
}
export const CartoviewSnackBar = (props) => {
    const { featureIdentifyLoading } = useContext(BasicViewerContext)
    const messageComponent = <SnackMessage message={"Searching For Features at this Point"} />
    return <Snackbar
        open={featureIdentifyLoading}
        ContentProps={{
            'aria-describedby': 'message-id',
        }}
        message={messageComponent} />
}
export const CustomizedSnackBar = (props) => {
    const { message, open, autoHideDuration, handleClose, variant } = props
    return (<Snackbar
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
    >
        <MySnackbarContentWrapper
            onClose={handleClose}
            variant={variant}
            message={message}
        />
    </Snackbar>)
}
CustomizedSnackBar.propTypes = {
    message: PropTypes.string,
    open: PropTypes.bool,
    autoHideDuration: PropTypes.number.isRequired,
    variant: PropTypes.string.isRequired,
    handleClose: PropTypes.func.isRequired,
}
CustomizedSnackBar.defaultProps = {
    handleClose: function () {

    },
    open: false,
    autoHideDuration: 6000,
    variant: "success",
    message: "This is a success message!"
}

export function FileUpload(props) {
    const { handleFiles, multiple, accept, label } = props
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop: handleFiles,
        multiple,
        accept
    })

    const files = acceptedFiles.map(file => (
        <li key={file.name}>
            {file.name} - {file.size} bytes
    </li>
    ))
    return (
        <section className="container">
            <div {...getRootProps({ className: 'dropzone disabled' })}>
                <input {...getInputProps()} />
                <p>{label}</p>
            </div>
            <aside>
                <h4>{"Files"}</h4>
                <ul>{files}</ul>
            </aside>
        </section>
    );
}
FileUpload.propTypes = {
    handleFiles: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    label: PropTypes.string,
    accept: PropTypes.oneOfType([PropTypes.string, PropTypes.string])
}
FileUpload.defaultProps = {
    handleFiles: function (files) {
        console.log(files)
    },
    multiple: false,
    accept: '*/*',
    label: "Drag 'n' drop some files here, or click to select files"
}