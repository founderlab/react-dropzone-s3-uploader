'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactS3UploaderS3upload = require('react-s3-uploader/s3upload');

var _reactS3UploaderS3upload2 = _interopRequireDefault(_reactS3UploaderS3upload);

var _reactDropzone = require('react-dropzone');

var _reactDropzone2 = _interopRequireDefault(_reactDropzone);

var DropzoneS3Uploader = (function (_React$Component) {
  _inherits(DropzoneS3Uploader, _React$Component);

  _createClass(DropzoneS3Uploader, null, [{
    key: 'propTypes',
    value: {
      filename: _propTypes2['default'].string,
      s3Url: _propTypes2['default'].string.isRequired,
      notDropzoneProps: _propTypes2['default'].array.isRequired,
      isImage: _propTypes2['default'].func.isRequired,
      passChildrenProps: _propTypes2['default'].bool,

      imageComponent: _propTypes2['default'].func,
      fileComponent: _propTypes2['default'].func,
      progressComponent: _propTypes2['default'].func,
      errorComponent: _propTypes2['default'].func,

      children: _propTypes2['default'].oneOfType([_propTypes2['default'].node, _propTypes2['default'].func]),

      onDrop: _propTypes2['default'].func,
      onError: _propTypes2['default'].func,
      onProgress: _propTypes2['default'].func,
      onFinish: _propTypes2['default'].func,

      // Passed to react-s3-uploader
      upload: _propTypes2['default'].object.isRequired,

      // Default styles for react-dropzone
      className: _propTypes2['default'].oneOfType([_propTypes2['default'].string, _propTypes2['default'].object]),
      style: _propTypes2['default'].object,
      activeStyle: _propTypes2['default'].object,
      rejectStyle: _propTypes2['default'].object
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      upload: {},
      className: 'react-dropzone-s3-uploader',
      passChildrenProps: true,
      isImage: function isImage(filename) {
        return filename && filename.match(/\.(jpeg|jpg|gif|png|svg)/i);
      },
      notDropzoneProps: ['onFinish', 's3Url', 'filename', 'host', 'upload', 'isImage', 'notDropzoneProps'],
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
      }
    },
    enumerable: true
  }]);

  function DropzoneS3Uploader(props) {
    var _this = this;

    _classCallCheck(this, DropzoneS3Uploader);

    _React$Component.call(this);

    this.componentWillMount = function () {
      return _this.setUploaderOptions(_this.props);
    };

    this.componentWillReceiveProps = function (props) {
      return _this.setUploaderOptions(props);
    };

    this.setUploaderOptions = function (props) {
      _this.setState({
        uploaderOptions: Object.assign({
          signingUrl: '/s3/sign',
          s3path: '',
          contentDisposition: 'auto',
          uploadRequestHeaders: { 'x-amz-acl': 'public-read' },
          onFinishS3Put: _this.handleFinish,
          onProgress: _this.handleProgress,
          onError: _this.handleError
        }, props.upload)
      });
    };

    this.handleProgress = function (progress, textState, file) {
      _this.props.onProgress && _this.props.onProgress(progress, textState, file);
      _this.setState({ progress: progress });
    };

    this.handleError = function (err, file) {
      _this.props.onError && _this.props.onError(err, file);
      _this.setState({ error: err, progress: null });
    };

    this.handleFinish = function (info, file) {
      var uploadedFile = Object.assign({
        file: file,
        fileUrl: _this.fileUrl(_this.props.s3Url, info.filename)
      }, info);

      var uploadedFiles = _this.state.uploadedFiles;
      uploadedFiles.push(uploadedFile);
      _this.setState({ uploadedFiles: uploadedFiles, error: null, progress: null }, function () {
        _this.props.onFinish && _this.props.onFinish(uploadedFile);
      });
    };

    this.handleDrop = function (files, rejectedFiles) {
      _this.setState({ uploadedFiles: [], error: null, progress: null });
      var options = _extends({
        files: files
      }, _this.state.uploaderOptions);
      new _reactS3UploaderS3upload2['default'](options); // eslint-disable-line
      _this.props.onDrop && _this.props.onDrop(files, rejectedFiles);
    };

    this.fileUrl = function (s3Url, filename) {
      return (s3Url.endsWith('/') ? s3Url.slice(0, -1) : s3Url) + '/' + filename;
    };

    this.renderImage = function (_ref) {
      var uploadedFile = _ref.uploadedFile;
      return _react2['default'].createElement(
        'div',
        { className: 'rdsu-image' },
        _react2['default'].createElement('img', { src: uploadedFile.fileUrl })
      );
    };

    this.renderFile = function (_ref2) {
      var uploadedFile = _ref2.uploadedFile;
      return _react2['default'].createElement(
        'div',
        { className: 'rdsu-file' },
        _react2['default'].createElement(
          'div',
          { className: 'rdsu-file-icon' },
          _react2['default'].createElement('span', { className: 'fa fa-file-o', style: { fontSize: '50px' } })
        ),
        _react2['default'].createElement(
          'div',
          { className: 'rdsu-filename' },
          uploadedFile.file.name
        )
      );
    };

    this.renderProgress = function (_ref3) {
      var progress = _ref3.progress;
      return progress ? _react2['default'].createElement(
        'div',
        { className: 'rdsu-progress' },
        progress
      ) : null;
    };

    this.renderError = function (_ref4) {
      var error = _ref4.error;
      return error ? _react2['default'].createElement(
        'div',
        { className: 'rdsu-error small' },
        error
      ) : null;
    };

    var uploadedFiles = [];
    var filename = props.filename;

    if (filename) {
      uploadedFiles.push({
        filename: filename,
        fileUrl: this.fileUrl(props.s3Url, filename),
        'default': true,
        file: {}
      });
    }
    this.state = { uploadedFiles: uploadedFiles };
  }

  DropzoneS3Uploader.prototype.render = function render() {
    var _this2 = this;

    var _props = this.props;
    var s3Url = _props.s3Url;
    var passChildrenProps = _props.passChildrenProps;
    var children = _props.children;
    var imageComponent = _props.imageComponent;
    var fileComponent = _props.fileComponent;
    var progressComponent = _props.progressComponent;
    var errorComponent = _props.errorComponent;

    var dropzoneProps = _objectWithoutProperties(_props, ['s3Url', 'passChildrenProps', 'children', 'imageComponent', 'fileComponent', 'progressComponent', 'errorComponent']);

    var ImageComponent = imageComponent || this.renderImage;
    var FileComponent = fileComponent || this.renderFile;
    var ProgressComponent = progressComponent || this.renderProgress;
    var ErrorComponent = errorComponent || this.renderError;

    var uploadedFiles = this.state.uploadedFiles;

    var childProps = _extends({ s3Url: s3Url }, this.state);
    this.props.notDropzoneProps.forEach(function (prop) {
      return delete dropzoneProps[prop];
    });

    var content = null;
    if (children) {
      content = passChildrenProps ? _react2['default'].Children.map(children, function (child) {
        return _react2['default'].cloneElement(child, childProps);
      }) : this.props.children;
    } else {
      content = _react2['default'].createElement(
        'div',
        null,
        uploadedFiles.map(function (uploadedFile) {
          var props = _extends({
            key: uploadedFile.filename,
            uploadedFile: uploadedFile
          }, childProps);
          return _this2.props.isImage(uploadedFile.fileUrl) ? _react2['default'].createElement(ImageComponent, props) : _react2['default'].createElement(FileComponent, props);
        }),
        _react2['default'].createElement(ProgressComponent, childProps),
        _react2['default'].createElement(ErrorComponent, childProps)
      );
    }

    return _react2['default'].createElement(
      _reactDropzone2['default'],
      _extends({ ref: function (c) {
          return _this2._dropzone = c;
        } }, dropzoneProps, { onDrop: this.handleDrop }),
      content
    );
  };

  return DropzoneS3Uploader;
})(_react2['default'].Component);

exports['default'] = DropzoneS3Uploader;
module.exports = exports['default'];