import React from 'react';

export default class UploadImg extends React.Component {
  constructor() {
    super();
    this.state = {
      files: []
     }
    this.fileChangeHandler = this.fileChangeHandler.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  fileChangeHandler(e) {
    let slicedFile = this.state.files.slice();
    slicedFile.push(URL.createObjectURL(event.target.files[0]))
    console.log('slicedfile', slicedFile);
    this.setState({ files: slicedFile })
  }
  // handleSubmit(e) {
  //   const fileData = new FormData();
  //   this.state.files.forEach((file) => fileData.append('files[]', file));
  //   // ... Submit fileData
  // }



  render() {
    return(
      <div>
      {
        this.state.files.map((file) => {
          console.log('each file', file);
          return (
          <img style={{width: '150px', height: '100px'}} src={file}></img>
          );
        })
      }
      <input type='file' multiple onChange={this.fileChangeHandler}/>
      <button onClick={this.handleSubmit}>Upload</button>
      </div>
    )
  }
}