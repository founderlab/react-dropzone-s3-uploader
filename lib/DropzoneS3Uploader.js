'use strict';

var _reactTransformCatchErrors2 = require('react-transform-catch-errors');

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _reactTransformCatchErrors3 = _interopRequireDefault(_reactTransformCatchErrors2);

var _react = require('react');

var _redboxReact = require('redbox-react');

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

exports.__esModule = true;

var _react2 = _interopRequireDefault(_react);

var _reactS3UploaderS3upload = require('react-s3-uploader/s3upload');

var _reactS3UploaderS3upload2 = _interopRequireDefault(_reactS3UploaderS3upload);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var _components = {
  _$DropzoneS3Uploader: {
    displayName: 'DropzoneS3Uploader'
  }
};

var _reactComponentWrapper = _reactTransformCatchErrors3['default']({
  filename: 'src/DropzoneS3Uploader.js',
  components: _components,
  locals: [],
  imports: [_react, _redboxReact]
});

function _wrapComponent(uniqueId) {
  return function (ReactClass) {
    return _reactComponentWrapper(ReactClass, uniqueId);
  };
}

var DropzoneS3Uploader = (function (_React$Component) {
  _inherits(DropzoneS3Uploader, _React$Component);

  function DropzoneS3Uploader() {
    var _this = this;

    _classCallCheck(this, _DropzoneS3Uploader);

    _React$Component.apply(this, arguments);

    this.onProgress = function (progress) {
      _this.props.onProgress && _this.props.onProgress(progress);
      _this.setState({ progress: progress });
    };

    this.onError = function (err) {
      _this.props.onError && _this.props.onError(err);
      _this.setState({ error: err, progress: null });
    };

    this.onFinish = function (info) {
      _this.setState({ filename: info.filename, error: null, progress: null }, function () {
        return _this.props.onFinish && _this.props.onFinish(info);
      });
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
      if (error) return _this.onError(error);

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

      _this.props.onDrop && _this.props.onDrop(files);
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
      onDrop: _react.PropTypes.func,

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

  var _DropzoneS3Uploader = DropzoneS3Uploader;
  DropzoneS3Uploader = _wrapComponent('_$DropzoneS3Uploader')(DropzoneS3Uploader) || DropzoneS3Uploader;
  return DropzoneS3Uploader;
})(_react2['default'].Component);

exports['default'] = DropzoneS3Uploader;
module.exports = exports['default'];