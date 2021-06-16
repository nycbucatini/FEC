import React from 'react';
import axios from 'axios';
import Answer from './Answer.jsx';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
//this.props.questionObject
class QuestionBody extends React.Component {
  constructor(props) {
    super(props);

    this.helpful = this.helpful.bind(this);
    this.report = this.report.bind(this);
    this.loadAll = this.loadAll.bind(this);
    this.comparator = this.comparator.bind(this);
    var answers = Object.keys(this.props.questionObject.answers).map((key) => this.props.questionObject.answers[key]);
    answers.sort(this.comparator);
    var answersShowing = answers.slice(0, 2);
    this.state = {
      helpfulCount: this.props.questionObject.question_helpfulness,
      reported: false,
      answers: answers,
      answersShowing: answersShowing,
      showingAll: answersShowing.length === answers.length
    };
    console.log(this.props.questionObject.answers);
    console.log(this.state.answersShowing, 'answers showing');
  }

  comparator(a, b) {
    if (a.answerer_name === 'Seller' && b.answerer_name === 'Seller') {
      return b.helpfulness - a.helpfulness;
    }
    if (a.answerer_name === 'Seller') {
      return -1;
    }
    if (b.answerer_name === 'Seller') {
      return 1;
    }
    return b.helpfulness - a.helpfulness;
  }

  helpful() {
    if (this.props.questionObject.question_helpfulness + 1 === this.state.helpfulCount) {
      return;
    }
    var options = {
      method: 'PUT',
      url: `${API_ROOT}/qa/questions/${this.props.questionObject.question_id}/helpful`,
      headers: {
        'Authorization': KEY
      }
    };
    axios(options)
      .then((response) => {
        // console.log(response);
        this.setState({
          helpfulCount: this.state.helpfulCount + 1
        });
      })
      .catch((err) => {
        console.log('darn', err);
      });
  }

  loadAll() {
    this.setState({
      answersShowing: this.state.answers,
      showingAll: true
    })
  }

  report() {
    if (this.state.reported) {
      return;
    }
    var options = {
      method: 'PUT',
      url: `${API_ROOT}/qa/questions/${this.props.questionObject.question_id}/report`,
      headers: {
        'Authorization': KEY
      }
    };
    axios(options)
      .then((response) => {
        // console.log('report: ', response);
        this.setState({
          reported: true
        });
      })
      .catch((err) => {
        console.log('cry', err);
      });
  }

  render() {
    return (
      <div className="question">
        <div className="questionHeaderRow">
          <h4 className="qaHeader">Q&#58;&nbsp;{this.props.questionObject.question_body}</h4>
          <div className="questionButtonRow">
            <p className="qaNonLink">Helpful&#63;&nbsp;</p>
            <p className={this.state.helpfulCount > this.props.questionObject.question_helpfulness ? "qaClicked" : "qaLinkButton"} onClick={this.helpful}>Yes</p>
            <p>&nbsp;&#40;{this.state.helpfulCount}&#41;</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className="qaLinkButton">Add Answer</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className={this.state.reported ? "qaNonLink" : "qaLinkButton"} onClick={this.report}>{this.state.reported ? 'Reported' : 'Report'}</p>
          </div>
        </div>
        <div className="answersContainer">
          {this.state.answersShowing.map(answer =>
            <Answer answerObject={answer}/>
          )}
        </div>
        {!this.state.showingAll &&
          <p className="loadAnswersButton" onClick={this.loadAll}>
            Load More Answers
          </p>
        }
      </div>
    );
  }
}

export default QuestionBody;