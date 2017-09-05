# Drag and drop s3 file uploader for React

This component uploads files dropped into [react-dropzone](https://github.com/okonet/react-dropzone) to s3 with [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader).

For more detailed docs see the source packages
- [react-dropzone](https://github.com/okonet/react-dropzone)
- [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader)



## Usage (client)


#### Available props

`s3Url` and `upload` are the only props that require configuration. All others have sensible defaults that may be overridden.

    
Prop              | Type              | Description                                 
----------------- | ----------------- | ------------------------------------------- 
s3Url             | string.isRequired | The url of your s3 bucket (`https://my-bucket.s3.amazonaws.com`)
upload            | object.isRequired | Upload options passed to react-s3-uploader. See [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader) for available options. Don't set `onProgress`, `onError` or `onFinish` here - use the ones below
filename          | string            | Used as the default value if present. Filename of an image already hosted on s3 (i.e. one that was uploaded previously)
notDropzoneProps  | array             | A list of props to *not* pass to `react-dropzone`
isImage           | func              | A function that takes a filename and returns true if it's an image
imageComponent    | func              | Component used to render an uploaded image
fileComponent     | func              | Component used to render an uploaded file
progressComponent | func              | Component used to render upload progress
errorComponent    | func              | Component used to render an error
children          | node \|\| func    | If present the above components will be ignored in favour of the children
passChildrenProps | bool              | If true we pass the current state to children of this component. Default is true. Set to false to avoid React warnings about unused props.
onDrop            | func              | Called when a file is dropped onto the uploader
onError           | func              | Called when an upload error occurs
onProgress        | func              | Called when a chunk has been uploaded
onFinish          | func              | Called when a file has completed uploading. Called once per file if multi=true
...rest           |                   | All other props are passed on to the `react-dropzone` component


#### Example
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
      signingUrlQueryParams: {uploadType: 'avatar'},
    }
    const s3Url = 'https://my-bucket.s3.amazonaws.com'

    return (
      <DropzoneS3Uploader
        onFinish={this.handleFinishedUpload}
        s3Url={s3Url}
        maxSize={1024 * 1024 * 5}
        upload={uploadOptions}
      />
    )
  }
}
```

#### Custom display component
Specify your own component to display uploaded files. Passed a list of `uploadedFile` objects.

```javascript

// elsewhere
class UploadDisplay extends React.Component {
  
  renderFileUpload = (uploadedFile, i) => {
    const {
      filename,   // s3 filename
      fileUrl,    // full s3 url of the file
      file,       // file descriptor from the upload
    } = uploadedFile

    return (
      <div key={i}>
        <img src={fileUrl} />
        <p>{file.name}</p>
      </div>
    )
  }

  render() {
    const {uploadedFiles, s3Url} = this.props
    return (
      <div> 
        {uploadedFiles.map(this.renderFileUpload)}
      </div>
    )
  }
}

// back in your uploader...
class S3Uploader extends React.Component {

  //...

  render() {
    return (
      <DropzoneS3Uploader 
        onFinish={this.handleFinishedUpload} 
        upload={uploadOptions}
      >
        <UploadDisplay />
      </DropzoneS3Uploader>
    )
  }
}
```


## Usage (server)

- Use s3Router from react-s3-uploader to get signed urls for uploads.
- `react-dropzone-s3-uploader/s3router` can be used as an alias for `react-s3-uploader/s3router`.
- See [react-s3-uploader](https://github.com/odysseyscience/react-s3-uploader) for more details.

```javascript
app.use('/s3', require('react-dropzone-s3-uploader/s3router')({
  bucket: 'MyS3Bucket',                           // required
  region: 'us-east-1',                            // optional
  headers: {'Access-Control-Allow-Origin': '*'},  // optional
  ACL: 'private',                                 // this is the default - set to `public-read` to let anyone view uploads
}));
```
