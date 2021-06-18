import React from 'react';
import axios from 'axios';
import KEY from '../config.js';
import IMGKEY from '../config.js';
import imgbbKEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';

//this.props.close
//this.props.questionId
class AnswerForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.loadFile = this.loadFile.bind(this);
    this.uploadImage = this.uploadImage.bind(this);

    this.state = {
      question: '',
      nickname: '',
      email: '',
      alerts: [],
      buttonText: 'SEND',
      filesUploaded: 0
    };
  }

  loadFile(e) {
    if (this.state.filesUploaded === 5) {
      return;
    }
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => {
      // this.uploadImage(btoa(reader.result));
    }
    var image = document.getElementById('' + this.state.filesUploaded);
    image.src = URL.createObjectURL(e.target.files[0]);
    this.setState({
      filesUploaded: this.state.filesUploaded + 1
    });
  }

  //have tried multiple image upload apis, nothing works
  uploadImage(file) {
    console.log('file upload', file);
    var data = new FormData();
    data.append('image', file);
    var options = {
      method: 'POST',
      url: 'https://api.imgbb.com/1/upload',
      params: {
        key: imgbbKEY,
        name: 'test2',
        image: file
      },
    };
    axios(options)
      .then((response) => {
        console.log('upload response', response);
      })
      .catch((err) => {
        console.log('no silly pictures', err.body);
      })
  }

  handleChange(event) {
    var name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit() {
    this.props.logInteraction('submitAnswer');
    var newAlerts = [];
    if (this.state.question.length < 10) {
      newAlerts.push("Answer- 10 character minimum");
    }
    if(this.state.nickname.length < 5) {
      newAlerts.push("Nickname - 5 character minimum");
    }
    if(this.validateEmail(this.state.email) === false) {
      newAlerts.push("Invalid Email");
    }
    if (newAlerts.length > 0 || this.state.buttonText !== 'SEND') {
      this.setState({
        alerts: newAlerts
      });
      return;
    }
    //send
    this.setState({
      alerts: []
    });
    var options = {
      method: 'POST',
      url: `${API_ROOT}/qa/questions/${this.props.questionId}/answers`,
      headers: {
        'Authorization': KEY
      },
      data: {
        body: this.state.question,
        name: this.state.nickname,
        email: this.state.email,
        photos: []
      }
    };
    axios(options)
      .then((response) => {
        console.log('new answer response', response);
        this.setState({
          buttonText: 'ANSWER RECEIVED'
        });
      })

      .catch((err) => {
        console.log('barf', err);
        this.setState({
          buttonText: 'SERVER ERROR'
        });
      });
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  render() {
    return (
      <div className="questionForm">
        <svg id="questionFormClose" style={{zIndex: 5, position: 'fixed', top: '20%', left: '85%', cursor: 'pointer'}} width={48} height={48} onClick={this.props.close} data-name="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M72 11.77L60.23 0 36 24.23 11.77 0 0 11.77 24.23 36 0 60.23 11.77 72 36 47.77 60.23 72 72 60.23 47.77 36 72 11.77z"/></svg>
        <h5 className="formPrompt">Add Your Answer</h5>
        <textarea
          className="questionTextArea formInput"
          rows={3}
          name="question"
          placeholder="Ex: Why did you like the product or not?"
          value={this.state.name}
          onChange={this.handleChange}
          onClick={() => {this.props.logInteraction('answerFormAnswer')}}
        />
        <h5 className="formPrompt">What's Your Nickname?</h5>
        <input
          name="nickname"
          className="formInput"
          type="text"
          placeholder="For your privacy, please do not use your full name or email"
          value={this.state.nickname}
          onChange={this.handleChange}
          onClick={() => {this.props.logInteraction('answerFormNickname')}}
        />
        <h5 className="formPrompt">Your Email</h5>
        <input
          name="email"
          className="formInput"
          type="text"
          placeholder="You will not be emailed. #nospam"
          value={this.state.email}
          onChange={this.handleChange}
          onClick={() => {this.props.logInteraction('answerFormEmail')}}
        />
        <div className="fileLoadRow">
        <h5 className="formPrompt">Upload up to 5 Images</h5>
        <input
          className="fileButton"
          name="image"
          type="file"
          accept="image/*"
          onChange={this.loadFile}
          onClick={() => {this.props.logInteraction('fileButton')}}
        />
        </div>
        <div className="uploadedImages">
          <img className="uploadedImage"id="0"/>
          <img className="uploadedImage"id="1"/>
          <img className="uploadedImage"id="2"/>
          <img className="uploadedImage"id="3"/>
          <img className="uploadedImage"id="4"/>
        </div>

        <div className="questionAlertsBox">
          {this.state.alerts.map(alert =>
            <p className="questionAlert">{alert}</p>
          )}
        </div>
        <button className="submitQuestion" onClick={this.handleSubmit}>{this.state.buttonText}</button>
      </div>
    );
  }
}
export default AnswerForm;