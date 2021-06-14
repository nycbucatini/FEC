import React from 'react';
//this.props.questionObject
class QuestionBody extends React.Component {
  constructor(props) {
    super(props);

    this.helpful = this.helpful.bind(this);
    this.report = this.report.bind(this);

    this.state = {
      helpfulCount: this.props.questionObject.question_helpfulness,
      reported: false
    };
  }

  helpful() {
    this.setState({
      helpfulCount: this.state.helpfulCount + 1
    });
  }

  report() {
    this.setState({
      reported: true
    });
  }

  render() {
    return (
      <div className="question">
        <div className="questionHeaderRow">
          <h4 className="qaHeader">Q&#58;&nbsp;{this.props.questionObject.question_body}</h4>
          <div className="questionButtonRow">
            <p className="qaNonLink">Helpful&#63;&nbsp;</p>
            <p className="qaLinkButton" onClick={this.helpful}>Yes</p>
            <p>&nbsp;&#40;{this.state.helpfulCount}&#41;</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className="qaLinkButton">Add Answer</p>
            <p>&nbsp;&#124;&nbsp;</p>
            <p className={this.state.reported ? "qaNonLink" : "qaLinkButton"} onClick={this.report}>{this.state.reported ? 'Reported' : 'Report'}</p>
          </div>
        </div>
        <div className="answersContainer">

        </div>
      </div>
    );
  }
}

export default QuestionBody;