import React from 'react';
import axios from 'axios';
import AnswerImage from './answerImage.jsx';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';

//this.props.answerObject
//this.props.search
class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.helpful = this.helpful.bind(this);
    this.report = this.report.bind(this);

    this.state = {
      helpfulCounter: this.props.answerObject.helpfulness,
      reported: false
    };
  }

  helpful() {
    if (this.props.answerObject.helpfulness + 1 === this.state.helpfulCounter) {
      return;
    }
    var options = {
      method: 'PUT',
      url: `${API_ROOT}/qa/answers/${this.props.answerObject.id}/helpful`,
      headers: {
        'Authorization': KEY
      }
    };
    axios(options)
      .then((response) => {
        // console.log('helpful response', response.data);
        this.setState({
          helpfulCounter: this.state.helpfulCounter + 1
        });
      })
      .catch((err) => {
        console.log('darn', err);
      });
  }

  report() {
    if (this.props.reported) {
      return;
    }
    var options = {
      method: 'PUT',
      url: `${API_ROOT}/qa/answers/${this.props.answerObject.id}/report`,
      headers: {
        'Authorization': KEY
      }
    };
    axios(options)
      .then((response) => {
        console.log('report answer', response);
        this.setState({
          reported: true
        });
      })
      .catch((err) => {
        console.log('danggit', err);
      });
  }

  render() {
    var answerBodySegments = this.props.answerObject.body.split(new RegExp(this.props.search, 'i'));
    var styledBody = [];
    for (var i = 0; i < answerBodySegments.length; i++) {
      styledBody.push(<React.Fragment>{answerBodySegments[i]}</React.Fragment>);
      styledBody.push(<mark>{this.props.search}</mark>)
    }
    styledBody.pop();

    return (
      <div className="answerBody">
        <p className="answerText"><b>A&#58;&nbsp;</b>{styledBody}</p>
        <div className="answerImageRow">
          {this.props.answerObject.photos.map(url =>
            <AnswerImage url={url} />
          )}
        </div>
        <div className="answerBottomRow">
          <p className="qaNonLink">By&nbsp;{this.props.answerObject.answerer_name},&nbsp;{(new Date(this.props.answerObject.date)).toDateString().slice(4)}&nbsp;&#124;&nbsp;Helpful&#63;&nbsp;</p>
          <p className={this.state.helpfulCounter > this.props.answerObject.helpfulness ? "qaClicked" : "qaLinkButton"} onClick={this.helpful}>Yes</p>
          <p>&nbsp;&#40;{this.state.helpfulCounter}&#41;&nbsp;&#124;&nbsp;</p>
          <p className={this.state.reported ? "qaNonLink" : "qaLinkButton"} onClick={this.report}>{this.state.reported ? 'Reported' : 'Report'}</p>
        </div>
      </div>
    );
  }
}
export default Answer;