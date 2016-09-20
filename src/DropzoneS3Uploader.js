import React, {PropTypes} from 'react'
import S3Upload from 'react-s3-uploader/s3upload'
import Dropzone from 'react-dropzone'

export default class DropzoneS3Uploader extends React.Component {

  static propTypes = {
    host: PropTypes.string,
    server: PropTypes.string,
    s3Url: PropTypes.string,
    s3_url: PropTypes.string,
    signing_url: PropTypes.string,
    signingUrl: PropTypes.string,
    signing_url_query_params: PropTypes.object,
    signingUrlQueryParams: PropTypes.object,

    fileComponent: PropTypes.func,
    progressComponent: PropTypes.func,

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

  static defaultProps = {
    className: 'react-dropzone-s3-uploader',
    multiple: false,
    isImage: filename => filename && filename.match(/\.(jpeg|jpg|gif|png|svg)/i),
    style: {
      width: 200,
      height: 200,
      border: 'dashed 2px #999',
      borderRadius: 5,
      position: 'relative',
      cursor: 'pointer',
      overflow: 'hidden',
    },
    activeStyle: {
      borderStyle: 'solid',
      backgroundColor: '#eee',
    },
    rejectStyle: {
      borderStyle: 'solid',
      backgroundColor: '#ffdddd',
    },
    imageStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      maxWidth: '100%',
      height: 'auto',
    },
  }

  onProgress = (progress) => {
    const progFn = this.props.onProgress
    if (progFn) progFn(progress)
    this.setState({progress})
  }

  onError = err => {
    const errFn = this.props.onError
    if (errFn) errFn(err)
    this.setState({error: err})
  }

  onFinish = (info) => {
    const finFn = this.props.onFinish
    if (finFn) finFn(info)
    this.setState({filename: info.filename, error: null, progress: null})
  }

  handleDrop = files => {
    let error = null
    const size = files[0].size
    const maxFileSize = this.props.max_file_size || this.props.maxFileSize

    if (!this.props.multiple && files.length > 1) {
      error = `Only drop one file`
    }
    else if (maxFileSize && size > maxFileSize) {
      const sizeKB = (size / 1024 / 1024).toFixed(2)
      const maxSizeKB = (maxFileSize / 1024 / 1024).toFixed(2)
      error = `Files must be smaller than ${maxSizeKB}KB. Yours is ${sizeKB}KB`
    }
    this.setState({error})
    if (error) return

    new S3Upload({ // eslint-disable-line
      files,
      signingUrl: this.props.signing_url || this.props.signingUrl || '/s3/sign',
      signingUrlQueryParams: this.props.signing_url_query_params || this.props.signingUrlQueryParams || {},
      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,
      uploadRequestHeaders: this.props.headers || {'x-amz-acl': 'public-read'},
      contentDisposition: 'auto',
      server: this.props.server || this.props.host || '',
    })

  }

  renderFileComponent = ({filename}) => (<div><span className="glyphicon glyphicon-file" style={{fontSize: '50px'}} />{filename}</div>)

  render() {
    const state = this.state || {filename: this.props.filename}
    const {className, style, multiple, accept} = this.props
    const {filename, progress, error} = state
    const s3Url = this.props.s3Url || this.props.s3_url
    const fileUrl = filename ? `${s3Url}/${filename}` : null
    const ProgressComponent = this.props.progressComponent
    const FileComponent = this.props.fileComponent || this.renderFileComponent

    const dropzoneProps = {
      className,
      style,
      multiple,
      accept,
      activeStyle: this.props.active_style || this.props.activeStyle,
      rejectStyle: this.props.reject_style || this.props.rejectStyle,
    }

    const imageStyle = this.props.image_style || this.props.imageStyle
    const childProps = {fileUrl, s3Url, filename, progress, error, imageStyle}

    let contents = null
    if (this.props.children) {
      contents = React.cloneElement(React.Children.only(this.props.children), childProps)
    }
    else if (fileUrl) {
      if (this.props.isImage(fileUrl)) {
        contents = (<img src={fileUrl} style={imageStyle} />)
      }
      else {
        contents = (<FileComponent {...childProps} />)
      }
    }

    return (
      <Dropzone onDrop={this.handleDrop} {...dropzoneProps} >
        {contents}
        {progress && ProgressComponent ? (<ProgressComponent progress={progress} />) : null}
        {error ? (<small>{error}</small>) : null}
      </Dropzone>
    )
  }
}
