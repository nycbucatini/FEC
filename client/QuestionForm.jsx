import React from 'react';
import axios from 'axios';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';

//this.props.close
class QuestionForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);

    this.state = {
      question: '',
      nickname: '',
      email: '',
      alerts: [],
      buttonText: 'SEND'
    };
  }

  handleChange(event) {
    var name = event.target.name;
    this.setState({
      [name]: event.target.value
    });
  }

  handleSubmit() {
    var newAlerts = [];
    if (this.state.question.length < 10) {
      newAlerts.push("Question - 10 character minimum");
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
      url: `${API_ROOT}/qa/questions`,
      headers: {
        'Authorization': KEY
      },
      data: {
        body: this.state.question,
        name: this.state.nickname,
        email: this.state.email,
        product_id: this.props.productId
      }
    };
    axios(options)
      .then((response) => {
        console.log('new question response', response);
        this.setState({
          buttonText: 'QUESTION RECEIVED'
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
        <h5 className="formPrompt">Ask Your Question</h5>
        <textarea
          className="questionTextArea formInput"
          rows={3}
          name="question"
          placeholder="Ex: Why did you like the product or not?"
          value={this.state.name}
          onChange={this.handleChange}
        />
        <h5 className="formPrompt">What's Your Nickname?</h5>
        <input
          name="nickname"
          className="formInput"
          type="text"
          placeholder="For your privacy, please do not use your full name or email"
          value={this.state.nickname}
          onChange={this.handleChange}
        />
        <h5 className="formPrompt">Your Email</h5>
        <input
          name="email"
          className="formInput"
          type="text"
          placeholder="You will not be emailed. #nospam"
          value={this.state.email}
          onChange={this.handleChange}
        />
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
export default QuestionForm;