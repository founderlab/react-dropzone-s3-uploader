# Drag and drop s3 file uploader via react-dropzone + react-s3-uploader

For more detailed docs see these:
- https://github.com/paramaggarwal/react-dropzone
- https://github.com/odysseyscience/react-s3-uploader


##### Usage (client): 

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

  const uploader_props = {
    style, 
    max_file_size: 1024 * 1024 * 50, 
    url: 'https://example/com', 
    s3_url: 'https://my-bucket.s3.amazonaws.com/', 
  }

  return (
    <DropzoneS3Uploader onFinish={this.handleFinishedUpload} {...uploader_props} />
  )
}

```

##### Usage (server): 

Use s3Router from react-s3-uploader to get signed urls for uploads.
See https://github.com/odysseyscience/react-s3-uploader for more details.
react-dropzone-s3-uploader/s3router can be used as an alias for react-s3-uploader/s3router.

```javascript
app.use('/s3', require('react-dropzone-s3-uploader/s3router')({
    bucket: "MyS3Bucket",
    region: 'us-east-1', //optional
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'private' // this is default
}));
```


##### Available options: 
(All camelCase options also work as underscored_names. e.g. maxFileSize and max_file_size are both fine)

```
url: your host
s3Url: your s3 base url
signingUrl: The path on your server to your s3 signed url generator (see the server section above)

headers: headers to send to your s3 signed url generator
multiple: Allow more than one file
filename: Initial filename (usually an image you've uploaded previously)
maxFileSize: Max size in bytes

style, activeStyle, rejectStyle: Styles to be passed to react-dropzone
imageStyle: Style object for the preview image

onError, onProgress, onFinish: Callbacks for the respective events
```
