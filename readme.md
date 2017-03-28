# Drag and drop s3 file uploader for React

This component uploads files dropped into [react-dropzone](https://github.com/okonet/react-dropzone) to s3 with [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader).

For more detailed docs see the source packages
- [react-dropzone](https://github.com/okonet/react-dropzone)
- [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader)



Usage (client):
---------------

#### Available props

`s3Url` and `upload` are the only props that require configuration. All others have sensible defaults that may be overridden.


Prop              | Type              | Description                                 
----------------- | ----------------- | ------------------------------------------- 
s3Url             | string.isRequired | The url of your s3 bucket (`https://my-bucket.s3.amazonaws.com/`)
upload            | object.isRequired | Upload options passed to react-s3-uploader
filename          | string            | Initial filename (existing data if used as part of a form)
notDropzoneProps  | array             | A list of props to *not* pass to `react-dropzone`
isImage           | func              | A function that takes a filename and returns true if it's an image
passChildrenProps | func              | Set to true to pass the current state to children of this component. Defaults to false if children are provided
imageComponent    | func              | Component used to render an uploaded image
fileComponent     | func              | Component used to render an uploaded file
progressComponent | func              | Component used to render upload progress
errorComponent    | func              | Component used to render an error
children          | node \|\| func    | If present the above components will be ignored in favour of the children
onDrop            | func              | Called when a file is dropped onto the uploader
onError           | func              | Called when an upload error occurs
onProgress        | func              | Called when a chunk has been uploaded
onFinish          | func              | Called when a file has completed uploading. Called once per file if multi=true
...rest           |                   | All other props are passed on to the `react-dropzone` component


```javascript
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'

export default class S3Uploader extends React.Component {

  handleFinishedUpload = info => {
    console.log('File uploaded with filename', info.filename)
    console.log('Access it on s3 at', info.fileUrl)
  }

  render() {
    const uploadOptions = {
      server: 'http://localhost:4000',
      s3Url: 'https://my-bucket.s3.amazonaws.com/',
      signingUrlQueryParams: {uploadType: 'avatar'},
    }

    return (
      <DropzoneS3Uploader 
        onFinish={this.handleFinishedUpload} 
        maxSize={1024 * 1024 * 5},
        upload={uploadOptions}
      />
    )
  }
}
```


Usage (server):
---------------

Use s3Router from react-s3-uploader to get signed urls for uploads.
See https://github.com/odysseyscience/react-s3-uploader for more details.
`react-dropzone-s3-uploader/s3router` can be used as an alias for `react-s3-uploader/s3router`.

```javascript
app.use('/s3', require('react-dropzone-s3-uploader/s3router')({
    bucket: 'MyS3Bucket',
    region: 'us-east-1', //optional
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'private' // this is default
}));
```


Available options:
------------------

<ul>
  <li> server: your servers url if different to the current domain</li>
  <li> s3Url: your s3 base url</li>
  <li> signingUrl: The path on your server to your s3 signed url generator (see the server section above)</li>
  <li> signingUrlQueryParams: Query params to add when making a request to the signing url</li>
</ul>
<ul>
  <li> headers: headers to send to your s3 signed url generator</li>
  <li> multiple: Allow more than one file</li>
  <li> filename: Filename of an image already hosted in the s3 server (usually an image you've uploaded previously), to be displayed in place of the uploader region.</li>
  <li> maxFileSize: Max size in bytes</li>
</ul>
<ul>
  <li> style, activeStyle, rejectStyle: Styles to be passed to react-dropzone</li>
  <li> imageStyle: Style object for the preview image</li>
</ul>
<ul>
  <li> onError, onProgress, onFinish, preprocess: Callbacks for the respective events</li>
</ul>
<ul>
  <li> uploaderOptions: Any additional options to be passed to the S3Upload instance</li>
</ul>
<ul>
  <li> ProgressComponent: A React component to place while the image is being uploaded. It requires that an onProgress callback had been defined.
</ul>
<ul>
  <li> hideErrorMessage: Do not show errors inside this component.
</ul>

Custom display component:
-------------------------
Specify your own display for an uploaded file.
```javascript
<DropzoneS3Uploader onFinish={this.handleFinishedUpload} {...uploaderProps}>
  <CustomElement />
</DropzoneS3Uploader>
```
