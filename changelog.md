
## [Unreleased]
  
## [0.8.1]
  - Fix bug caused by using _.map without importing it

## [0.8.0]
  - props.children no longer receive the `fileUrl`, `s3Url`, `filename`, `progress`, `error`, `imageStyle` props. If the `fileComponent` prop is specified it will receive these props. 
  - maxFileSize and minFileSize are passed to the `react-dropzone` component, which handles validation
  - multiple files are handled better. Props named `fileUrls` and `filenames` are passed to the `fileComponent`, with an entry per file uploaded.

## [0.7.3]
  - Accepts an prop named `onDrop`, a function to be called with the files object when files are dropped.

## [0.7.0]
  - Removed dependency on react-bootstrap
  - New props: 
    - `progressComponent`, a react component to render progress. Is provided a prop called `progress` with the current uploader progress percentage as an int (0-100).
    - `fileComponent` prop to do the same for rendering an uploaded file (not an image).
    - `isImage` a function that should return true if a filename represents an image. Default is `filename => filename && filename.match(/\.(jpeg|jpg|gif|png|svg)/i)`
  - If a child component is present it's only passed these props: `fileUrl, s3Url, filename, progress, error, imageStyle`

## [0.5.3]
  - Update React dependecy to include 15.x.x

## [0.5.0]
  - react-bootstrap dependency updated to ^0.29.0

## [0.4.2]
  - Renamed `host` option to `server` to match react-s3-uploader

## [0.4.1]
  - Pass accept prop to Dropzone

## [0.4.0]
  - Supports a display component via a child element.

## [0.3.1]
  - readme
