import React, {PropTypes} from 'react'
import {ProgressBar} from 'react-bootstrap'
import S3Upload from 'react-s3-uploader/s3upload'
import Dropzone from 'react-dropzone'

export default class DropzoneS3Uploader extends React.Component {

  static propTypes = {
    host: PropTypes.string,
    s3_url: PropTypes.string,
    s3Url: PropTypes.string,
    signing_url: PropTypes.string,
    signingUrl: PropTypes.string,

    children: PropTypes.element,
    headers: PropTypes.object,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    filename: PropTypes.string,
    max_file_size: PropTypes.number,
    maxFileSize: PropTypes.number,

    style: PropTypes.object,
    active_style: PropTypes.object,
    activeStyle: PropTypes.object,
    reject_style: PropTypes.object,
    rejectStyle: PropTypes.object,
    image_style: PropTypes.object,
    imageStyle: PropTypes.object,

    onError: PropTypes.func,
    onProgress: PropTypes.func,
    onFinish: PropTypes.func,
  }

  onProgress = (progress) => {
    const progFn = this.props.onProgress
    if (progFn) progFn(progress)
    this.setState({progress})
  }

  onError = (err) => {
    const errFn = this.props.onError
    if (errFn) errFn(err)
    this.setState({error: err})
  }

  onFinish = (info) => {
    const finFn = this.props.onFinish
    if (finFn) finFn(info)
    this.setState({filename: info.filename, error: null, progress: null})
  }

  static isImage(filename) {
    return filename && filename.match(/\.(jpeg|jpg|gif|png)/)
  }

  handleDrop = files => {
    let error = null
    const size = files[0].size
    const max_file_size = this.props.max_file_size || this.props.maxFileSize

    if (!this.props.multiple && files.length > 1) {
      error =`Only drop one file`
    }
    else if (max_file_size && size > max_file_size) {
      const size_kb = (size / 1024 / 1024).toFixed(2)
      const max_kb = (max_file_size / 1024 / 1024).toFixed(2)
      error = `Files nust be smaller than ${max_kb}kb. Yours is ${size_kb}kb`
    }
    this.setState({error})
    if (error) return

    new S3Upload({ // eslint-disable-line
      files,
      signingUrl: this.props.signing_url || this.props.signingUrl || '/s3/sign',
      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,
      uploadRequestHeaders: this.props.headers || {'x-amz-acl': 'public-read'},
      contentDisposition: 'auto',
      server: this.props.host || '',
    })

  }

  render() {
    const state = this.state || {filename: this.props.filename}
    const {filename, progress, error} = state
    const s3_url = this.props.s3_url || this.props.s3Url
    const file_url = filename ? `${s3_url}/${filename}` : null

    const dropzone_props = {
      style: this.props.style || {
        height: 200,
        border: 'dashed 2px #999',
        borderRadius: 5,
        position: 'relative',
        cursor: 'pointer',
      },
      activeStyle: this.props.active_style || this.props.activeStyle || {
        borderStyle: 'solid',
        backgroundColor: '#eee',
      },
      rejectStyle: this.props.reject_style || this.props.rejectStyle || {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd',
      },
      multiple: this.props.multiple || false,
      accept: this.props.accept,
    }

    const image_style = this.props.image_style || this.props.imageStyle || {
      position: 'absolute',
      top: 0,
      width: 'auto',
      height: '100%',
    }

    let contents = null
    if (this.props.children) {
      contents = React.cloneElement(React.Children.only(this.props.children), {
        file_url, s3_url, filename, progress, error, image_style,
        fileUrl: file_url, s3Url: s3_url, imageStyle: image_style,
      })
    }
    else if (file_url) {
      if (DropzoneS3Uploader.isImage(file_url)) {
        contents = (<img src={file_url} style={image_style} />)
      }
      else {
        contents = (<div><span className="glyphicon glyphicon-file" style={{fontSize: '50px'}} />{filename}</div>)
      }
    }

    return (
      <Dropzone onDrop={this.handleDrop} {...dropzone_props} >
        {contents}
        {progress ? (<ProgressBar now={progress} label="%(percent)s%" srOnly />) : null}
        {error ? (<small>{error}</small>) : null}
      </Dropzone>
    )
  }
}

