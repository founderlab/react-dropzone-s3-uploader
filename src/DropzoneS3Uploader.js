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
    signing_url_headers: PropTypes.object,
    signingUrlHeaders: PropTypes.object,
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
    isImage: PropTypes.func,

    children: PropTypes.element,
    headers: PropTypes.object,
    multiple: PropTypes.bool,
    accept: PropTypes.string,
    filename: PropTypes.string,
    max_file_size: PropTypes.number,
    maxFileSize: PropTypes.number,
    min_file_size: PropTypes.number,
    minFileSize: PropTypes.number,

    style: PropTypes.object,
    active_style: PropTypes.object,
    activeStyle: PropTypes.object,
    reject_style: PropTypes.object,
    rejectStyle: PropTypes.object,
    image_style: PropTypes.object,
    imageStyle: PropTypes.object,
    disable_click: PropTypes.bool,
    disableClick: PropTypes.bool,
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

  onProgress = progress => {
    this.props.onProgress && this.props.onProgress(progress)
    this.setState({progress})
  }

  onError = err => {
    this.props.onError && this.props.onError(err)
    this.setState({error: err, progress: null})
  }

  onFinish = info => {
    const filenames = this.state.filenames || []
    const filename = info.filename
    filenames.push(filename)
    this.setState({filename, filenames, error: null, progress: null}, () => this.props.onFinish && this.props.onFinish(info))
  }

  handleDrop = (files, rejectedFiles) => {
    this.setState({filenames: [], filename: null, error: null, progress: null})

    new S3Upload({ // eslint-disable-line
      files,
      signingUrl: this.props.signing_url || this.props.signingUrl || '/s3/sign',
      signingUrlQueryParams: this.props.signing_url_query_params || this.props.signingUrlQueryParams || {},
      signingUrlHeaders: this.props.signing_url_headers || this.props.signingUrlHeaders || {},
      onProgress: this.onProgress,
      onFinishS3Put: this.onFinish,
      onError: this.onError,
      uploadRequestHeaders: this.props.headers || {'x-amz-acl': 'public-read'},
      contentDisposition: 'auto',
      server: this.props.server || this.props.host || '',
    })

    this.props.onDrop && this.props.onDrop(files, rejectedFiles)
  }

  renderFileComponent = ({filename}) => (<div><span className="glyphicon glyphicon-file" style={{fontSize: '50px'}} />{filename}</div>)

  render() {
    const state = this.state || {filename: this.props.filename}
    const {className, style, multiple, accept} = this.props
    const {filename, filenames, progress, error} = state
    const s3Url = this.props.s3Url || this.props.s3_url
    const fileUrl = filename ? `${s3Url}/${filename}` : null
    const fileUrls = filenames ? filenames.map((filename) => {return(`${s3Url}/${filename}`)}) : null;
    const ProgressComponent = this.props.progressComponent
    const FileComponent = this.props.fileComponent || this.renderFileComponent

    const dropzoneProps = {
      className,
      style,
      multiple,
      accept,
      disableClick: this.props.disable_click || this.props.disableClick,
      activeStyle: this.props.active_style || this.props.activeStyle,
      rejectStyle: this.props.reject_style || this.props.rejectStyle,
      minSize: this.props.min_file_size || this.props.minFileSize,
      maxSize: this.props.max_file_size || this.props.maxFileSize,
    }

    const imageStyle = this.props.image_style || this.props.imageStyle
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
        {error ? (<small>{error}</small>) : null}
      </Dropzone>
    )
  }
}
