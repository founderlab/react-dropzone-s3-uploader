# Drag and drop s3 file uploader via react-dropzone + react-s3-uploader


For more detailed docs see these:
---------------------------------

- https://github.com/paramaggarwal/react-dropzone
- https://github.com/odysseyscience/react-s3-uploader



Usage (client): 
---------------

```javascript
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'

function MyComponent() {
  const style = {
    height: 200,
    border: 'dashed 2px #999',
    borderRadius: 5,
    position: 'relative',
    cursor: 'pointer',
  }

  const uploaderProps = {
    style, 
    maxFileSize: 1024 * 1024 * 50, 
    server: 'https://example/com', 
    s3Url: 'https://my-bucket.s3.amazonaws.com/', 
    signingUrlQueryParams: {uploadType: 'avatar'},
  }

  return (
    <DropzoneS3Uploader onFinish={this.handleFinishedUpload} {...uploaderProps} />
  )
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
(All camelCase options also work as underscored_names. e.g. maxFileSize and max_file_size are both fine)
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
  <li> onError, onProgress, onFinish: Callbacks for the respective events</li>
</ul>
<ul>
  <li> ProgressComponent: A React component to place while the image is being uploaded. It requires that an onProgress callback had been defined.
</ul>

Custom display component: 
-------------------------
Specify your own display for an uploaded file. Will receive these props:
```{fileUrl, s3Url, filename, progress, error, imageStyle}```
```javascript
<DropzoneS3Uploader onFinish={this.handleFinishedUpload} {...uploaderProps}>
  <CustomElement />
</DropzoneS3Uploader>
```
