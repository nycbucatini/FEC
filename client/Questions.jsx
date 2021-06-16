import React from 'react';
import axios from 'axios';
import KEY from '../config.js';
import QuestionSearch from './QuestionSearch.jsx';
import QuestionBody from './QuestionBody.jsx';
import QuestionForm from './QuestionForm.jsx';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
class Questions extends React.Component {
  constructor(props) {
    super(props);

    this.loadQuestions = this.loadQuestions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.state = {
      questions: [],
      nextPage: 1,

      expanded: false,

      dataReceived: false
    };
  }

  componentDidMount() {
    this.loadQuestions(this.state.nextPage)
      .then(() => {
        this.setState({
          dataReceived: true
        });
      })
      .catch((err) => {
        console.log('something failed to load', err);
      });
  }

  loadQuestions(page) {
    var options = {
      method: 'GET',
      url: `${API_ROOT}/qa/questions`,
      headers: {
        'Authorization': KEY
      },
      params: {
        page: page,
        count: 20,
        product_id: this.props.productId
      }
    }

    return axios(options)
    .then((response) => {
      console.log('LoadQuestions', response.data.results);
      this.setState({
        questions: this.state.questions.concat(response.data.results)
      });
    })
    .catch((err) => {
      console.log('loadQuestions oops', err);
    });
  }

  handleSearch(query) {

  }

  toggleForm() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    return (
      <div id="questionsBody">
        <h3 id="questionsHeader">QUESTIONS &#38; ANSWERS</h3>
        <QuestionSearch handleSearch={this.handleSearch} />
        {this.state.dataReceived &&
          <div id="questionList">
            {this.state.questions.map(question =>
              <QuestionBody questionObject={question} />
            )}
          </div>
        }
        <div className="qaWidgetButtonRow">
          <h4 className="qaWidgetButton">MORE ANSWERED QUESTIONS</h4>
          <h4 className="qaWidgetButton" onClick={this.toggleForm}>ADD A QUESTION &nbsp;&#43;</h4>
        </div>
        {this.state.expanded &&
          <div className="addQuestionDiv">
            <div className="questionFormBox">
              <QuestionForm close={this.toggleForm} productId={this.props.productId}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Questions;