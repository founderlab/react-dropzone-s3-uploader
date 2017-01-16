import React, {PropTypes} from 'react'
import S3Upload from 'react-s3-uploader/s3upload'
import Dropzone from 'react-dropzone'

export default class DropzoneS3Uploader extends React.Component {

  static propTypes = {
    host: PropTypes.string,
    server: PropTypes.string,
    s3Url: PropTypes.string,

    contentDisposition: PropTypes.string,
    signingUrl: PropTypes.string,
    signingUrlQueryParams: PropTypes.object,
    signingUrlHeaders: PropTypes.object,
    uploaderOptions: PropTypes.object,
    className: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),

    fileComponent: PropTypes.func,
    progressComponent: PropTypes.func,
    onDrop: PropTypes.func,
    onError: PropTypes.func,
    onProgress: PropTypes.func,
    onFinish: PropTypes.func,
    preprocess: PropTypes.func,
    isImage: PropTypes.func,

    children: PropTypes.element,
    headers: PropTypes.object,
    uploadRequestHeaders: PropTypes.object,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    filename: PropTypes.string,
    maxFileSize: PropTypes.number,
    minFileSize: PropTypes.number,

    style: PropTypes.object,
    activeStyle: PropTypes.object,
    rejectStyle: PropTypes.object,
    imageStyle: PropTypes.object,
    disableClick: PropTypes.bool,
    hideErrorMessage: PropTypes.bool,
  }

  static defaultProps = {
    uploaderOptions: {},
    signingUrl: '/s3/sign',
    uploadRequestHeaders: {'x-amz-acl': 'public-read'},
    contentDisposition: 'auto',
    signingUrlQueryParams: {},
    signingUrlHeaders: {},

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

  onProgress = (progress, textState, file) => {
    this.props.onProgress && this.props.onProgress(progress, textState, file)
    this.setState({progress})
  }

  onError = err => {
    this.props.onError && this.props.onError(err)
    this.setState({error: err, progress: null})
  }

  onFinish = (info, file) => {
    const filenames = this.state.filenames || []
    const filename = file.name
    filenames.push(filename)
    const newState = {filename, filenames, error: null, progress: null}
    this.setState(newState, () => this.props.onFinish && this.props.onFinish(info, file))
  }

  handleDrop = (files, rejectedFiles) => {
    this.setState({filenames: [], filename: null, error: null, progress: null})

    const options = Object.assign({
      files,
      signingUrl: this.props.signingUrl,
      signingUrlQueryParams: this.props.signingUrlQueryParams,
      signingUrlHeaders: this.props.signingUrlHeaders,

      uploadRequestHeaders: this.props.headers || this.props.uploadRequestHeaders,
      contentDisposition: this.props.contentDisposition,

      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,

      server: this.props.server || this.props.host || '',
    }, this.props.uploaderOptions)

    if (this.props.preprocess) options.preprocess = this.props.preprocess

    new S3Upload(options) // eslint-disable-line

    this.props.onDrop && this.props.onDrop(files, rejectedFiles)
  }

  renderFileComponent = ({filename}) => (<div><span className="glyphicon glyphicon-file" style={{fontSize: '50px'}} />{filename}</div>)

  render() {
    const state = this.state || {filename: this.props.filename}
    const {className, style, multiple, accept} = this.props
    const {filename, filenames, progress, error} = state
    const s3Url = this.props.s3Url
    const fileUrl = filename ? `${s3Url}/${filename}` : null
    const fileUrls = filenames ? filenames.map(filename => `${s3Url}/${filename}`) : null
    const ProgressComponent = this.props.progressComponent
    const FileComponent = this.props.fileComponent || this.renderFileComponent
    const hideErrorMessage = this.props.hideErrorMessage || false

    const dropzoneProps = {
      className,
      style,
      multiple,
      accept,
      disableClick: this.props.disableClick,
      activeStyle: this.props.activeStyle,
      rejectStyle: this.props.rejectStyle,
      minSize: this.props.minFileSize,
      maxSize: this.props.maxFileSize,
    }

    const imageStyle = this.props.imageStyle
    const childProps = {fileUrl, fileUrls, s3Url, filename, filenames, progress, error, imageStyle}

    let contents = null
    if (this.props.children) {
      contents = this.props.children
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
        {error && !hideErrorMessage ? (<small>{error}</small>) : null}
      </Dropzone>
    )
  }
}
