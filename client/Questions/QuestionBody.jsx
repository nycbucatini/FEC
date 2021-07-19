import React from 'react';
import axios from 'axios';
import Answer from './Answer.jsx';
import KEY from '../../config.js';
import AnswerForm from './AnswerForm.jsx';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
//this.props.questionObject
//this.props.search
class QuestionBody extends React.Component {
  constructor(props) {
    super(props);

    this.helpful = this.helpful.bind(this);
    this.report = this.report.bind(this);
    this.loadAll = this.loadAll.bind(this);
    this.comparator = this.comparator.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    var answers = Object.keys(this.props.questionObject.answers).map((key) => this.props.questionObject.answers[key]);
    answers.sort(this.comparator);
    var answersShowing = answers.slice(0, 2);
    if (this.props.search.length >= 3 && this.props.search !== 'dwdnwfbewfubdsijn') {
      answersShowing = answers;
    }
    this.state = {
      helpfulCount: this.props.questionObject.question_helpfulness,
      reported: false,
      answers: answers,
      answersShowing: answersShowing,
      showingAll: answersShowing.length === answers.length,

      expanded: false
    };
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
    this.props.logInteraction('helpfulQuestionButton');
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
        console.log('mark question helpful', response);
        this.setState({
          helpfulCount: this.state.helpfulCount + 1
        });
      })
      .catch((err) => {
        console.log('darn', err);
      });
  }

  loadAll() {
    this.props.logInteraction('loadAnswersButton');
    this.setState({
      answersShowing: this.state.answers,
      showingAll: true
    });
  }

  report() {
    this.props.logInteraction('reportQuestionButton');
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
        console.log('question report: ', response);
        this.setState({
          reported: true
        });
      })
      .catch((err) => {
        console.log('cry', err);
      });
  }

  toggleForm() {
    this.props.logInteraction(this.state.expanded ? 'answerFormClose' : 'addAnswerButton');
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    var questionBodySegments = this.props.questionObject.question_body.split(new RegExp(this.props.search, 'i'));
    var styledBody = [];
    for (var i = 0; i < questionBodySegments.length; i++) {
      styledBody.push(<React.Fragment>{questionBodySegments[i]}</React.Fragment>);
      styledBody.push(<mark>{this.props.search}</mark>)
    }
    styledBody.pop();
    return (
      <div className="question">
        <div className="questionHeaderRow">
          <h4 className="qaHeader">Q&#58;&nbsp;{styledBody}</h4>
          <div className="questionButtonRow">
            <p className="qaNonLink">Helpful&#63;&nbsp;</p>
            <p className={this.state.helpfulCount > this.props.questionObject.question_helpfulness ? "qaClicked" : "qaLinkButton"} onClick={this.helpful}>Yes</p>
            <p>&nbsp;&#40;{this.state.helpfulCount}&#41;</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className="qaLinkButton" onClick={this.toggleForm}>Add Answer</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className={this.state.reported ? "qaNonLink" : "qaLinkButton"} onClick={this.report}>{this.state.reported ? 'Reported' : 'Report'}</p>
          </div>
        </div>
        <div className="answersContainer">
          {this.state.answersShowing.map(answer =>
            <Answer answerObject={answer} search={this.props.search} logInteraction={this.props.logInteraction}/>
          )}
        </div>
        {!this.state.showingAll &&
          <p className="loadAnswersButton" onClick={this.loadAll}>
            Load More Answers
          </p>
        }
        {this.state.expanded &&
          <div className="addQuestionDiv">
            <div className="questionFormBox">
              <AnswerForm questionId={this.props.questionObject.question_id} close={this.toggleForm} logInteraction={this.props.logInteraction}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default QuestionBody;