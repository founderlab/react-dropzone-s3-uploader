'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactS3UploaderS3upload = require('react-s3-uploader/s3upload');

var _reactS3UploaderS3upload2 = _interopRequireDefault(_reactS3UploaderS3upload);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var DropzoneS3Uploader = (function (_React$Component) {
  _inherits(DropzoneS3Uploader, _React$Component);

  function DropzoneS3Uploader() {
    var _this = this;

    _classCallCheck(this, DropzoneS3Uploader);

    _React$Component.apply(this, arguments);

    this.onProgress = function (progress) {
      var progFn = _this.props.onProgress;
      if (progFn) progFn(progress);
      _this.setState({ progress: progress });
    };

    this.onError = function (err) {
      var errFn = _this.props.onError;
      if (errFn) errFn(err);
      _this.setState({ error: err, progress: null });
    };

    this.onFinish = function (info) {
      var finFn = _this.props.onFinish;
      if (finFn) finFn(info);
      _this.setState({ filename: info.filename, error: null, progress: null });
    };

    this.handleDrop = function (files) {
      var error = null;
      var size = files[0].size;
      var maxFileSize = _this.props.max_file_size || _this.props.maxFileSize;

      if (!_this.props.multiple && files.length > 1) {
        error = 'Only drop one file';
      } else if (maxFileSize && size > maxFileSize) {
        var sizeKB = (size / 1024 / 1024).toFixed(2);
        var maxSizeKB = (maxFileSize / 1024 / 1024).toFixed(2);
        error = 'Files must be smaller than ' + maxSizeKB + 'KB. Yours is ' + sizeKB + 'KB';
      }
      _this.setState({ error: error });
      if (error) return;

      new _reactS3UploaderS3upload2['default']({ // eslint-disable-line
        files: files,
        signingUrl: _this.props.signing_url || _this.props.signingUrl || '/s3/sign',
        signingUrlQueryParams: _this.props.signing_url_query_params || _this.props.signingUrlQueryParams || {},
        onProgress: _this.onProgress,
        onFinishS3Put: _this.onFinish,
        onError: _this.onError,
        uploadRequestHeaders: _this.props.headers || { 'x-amz-acl': 'public-read' },
        contentDisposition: 'auto',
        server: _this.props.server || _this.props.host || ''
      });
    };

    this.renderFileComponent = function (_ref) {
      var filename = _ref.filename;
      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement('span', { className: 'glyphicon glyphicon-file', style: { fontSize: '50px' } }),
        filename
      );
    };
  }

  DropzoneS3Uploader.prototype.render = function render() {
    var state = this.state || { filename: this.props.filename };
    var _props = this.props;
    var className = _props.className;
    var style = _props.style;
    var multiple = _props.multiple;
    var accept = _props.accept;
    var filename = state.filename;
    var progress = state.progress;
    var error = state.error;

    var s3Url = this.props.s3Url || this.props.s3_url;
    var fileUrl = filename ? s3Url + '/' + filename : null;
    var ProgressComponent = this.props.progressComponent;
    var FileComponent = this.props.fileComponent || this.renderFileComponent;

    var dropzoneProps = {
      className: className,
      style: style,
      multiple: multiple,
      accept: accept,
      activeStyle: this.props.active_style || this.props.activeStyle,
      rejectStyle: this.props.reject_style || this.props.rejectStyle
    };

    var imageStyle = this.props.image_style || this.props.imageStyle;
    var childProps = { fileUrl: fileUrl, s3Url: s3Url, filename: filename, progress: progress, error: error, imageStyle: imageStyle };

    var contents = null;
    if (this.props.children) {
      contents = _react2['default'].cloneElement(_react2['default'].Children.only(this.props.children), childProps);
    } else if (fileUrl) {
      if (this.props.isImage(fileUrl)) {
        contents = _react2['default'].createElement('img', { src: fileUrl, style: imageStyle });
      } else {
        contents = _react2['default'].createElement(FileComponent, childProps);
      }
    }

    return _react2['default'].createElement(
      _reactDropzone2['default'],
      _extends({ onDrop: this.handleDrop }, dropzoneProps),
      contents,
      progress && ProgressComponent ? _react2['default'].createElement(ProgressComponent, { progress: progress }) : null,
      error ? _react2['default'].createElement(
        'small',
        null,
        error
      ) : null
    );
  };

  _createClass(DropzoneS3Uploader, null, [{
    key: 'propTypes',
    value: {
      host: _react.PropTypes.string,
      server: _react.PropTypes.string,
      s3Url: _react.PropTypes.string,
      s3_url: _react.PropTypes.string,
      signing_url: _react.PropTypes.string,
      signingUrl: _react.PropTypes.string,
      signing_url_query_params: _react.PropTypes.object,
      signingUrlQueryParams: _react.PropTypes.object,

      fileComponent: _react.PropTypes.func,
      progressComponent: _react.PropTypes.func,

      children: _react.PropTypes.element,
      headers: _react.PropTypes.object,
      multiple: _react.PropTypes.bool,
      accept: _react.PropTypes.string,
      filename: _react.PropTypes.string,
      max_file_size: _react.PropTypes.number,
      maxFileSize: _react.PropTypes.number,

      style: _react.PropTypes.object,
      active_style: _react.PropTypes.object,
      activeStyle: _react.PropTypes.object,
      reject_style: _react.PropTypes.object,
      rejectStyle: _react.PropTypes.object,
      image_style: _react.PropTypes.object,
      imageStyle: _react.PropTypes.object,

      onError: _react.PropTypes.func,
      onProgress: _react.PropTypes.func,
      onFinish: _react.PropTypes.func
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      className: 'react-dropzone-s3-uploader',
      multiple: false,
      isImage: function isImage(filename) {
        return filename && filename.match(/\.(jpeg|jpg|gif|png|svg)/i);
      },
      style: {
        width: 200,
        height: 200,
        border: 'dashed 2px #999',
        borderRadius: 5,
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden'
      },
      activeStyle: {
        borderStyle: 'solid',
        backgroundColor: '#eee'
      },
      rejectStyle: {
        borderStyle: 'solid',
        backgroundColor: '#ffdddd'
      },
      imageStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        maxWidth: '100%',
        height: 'auto'
      }
    },
    enumerable: true
  }]);

  return DropzoneS3Uploader;
})(_react2['default'].Component);

exports['default'] = DropzoneS3Uploader;
module.exports = exports['default'];