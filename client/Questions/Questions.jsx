import _ from 'lodash';
import React from 'react';
import axios from 'axios';
import KEY from '../../config.js';
import QuestionSearch from './QuestionSearch.jsx';
import QuestionBody from './QuestionBody.jsx';
import QuestionForm from './QuestionForm.jsx';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
const HEADERS = {
  headers: {
    'Authorization' : KEY
  }
};
class Questions extends React.Component {
  constructor(props) {
    super(props);

    this.loadQuestions = this.loadQuestions.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    // this.handleSearch = _.debounce(this.handleSearch, 200);
    this.toggleForm = this.toggleForm.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.checkQuery = this.checkQuery.bind(this);
    this.filterQuestions = this.filterQuestions.bind(this);
    this.logInteraction.bind(this);
    this.state = {
      questions: [],

      expanded: false,

      allLoaded: false,

      search: 'dwdnwfbewfubdsijn',

      dataReceived: false
    };
  }

  componentDidMount() {
    this.loadQuestions(1, 2)
      .then(() => {
        this.setState({
          dataReceived: true
        });
      })
      .catch((err) => {
        console.log('something failed to load', err);
      });
  }

  logInteraction(element) {
    return axios.post(API_ROOT + '/interactions', {
      element: element,
      widget: 'Questions and Answers',
      time: Date.now().toString()
    }, HEADERS)
      .then((response) => {
        // console.log('Interaction logged ' + element, response);
      })
      .catch((err) => {
        console.log('danggit');
      });
  }

  loadQuestions(page, count = 20, callback = () => {}) {
    var options = {
      method: 'GET',
      url: `${API_ROOT}/qa/questions`,
      headers: {
        'Authorization': KEY
      },
      params: {
        page: page,
        count: count,
        product_id: this.props.productId
      }
    };

    return axios(options)
    .then((response) => {

      var newArray = this.state.questions.concat(response.data.results).slice();
      this.setState({
        allLoaded: response.data.results.length < this.state.questions.length ? true : false,
        questions: newArray
      }, callback);
    })
    .catch((err) => {
      console.log('loadQuestions oops', err);
    });
  }

  //Debounced 200ms
  handleSearch(query) {
    if (query.length < 3) {
      this.setState({
        search: 'dwdnwfbewfubdsijn',
        questions: [],
        allLoaded: false
      }, () => {
        this.loadQuestions(1, 2);
      });
    } else if (query.length >= 3) {
      this.setState({
        search: query,
        questions: [],
        allLoaded: false
      }, () => {
        this.loadQuestions(1, 20, () => {this.filterQuestions(query)});
      });
    }

  }

  filterQuestions(query) {
    var newQuestions = [];
    for (var i = 0; i < this.state.questions.length; i++) {
      if (this.checkQuery(this.state.questions[i], query)) {
        newQuestions.push(this.state.questions[i]);
      }
    }
    this.setState({
      questions: newQuestions
    });
  }

  loadMore() {
    var numberToLoad = this.state.questions.length;
    if (this.state.search.length >= 3 && this.state.search !== 'dwdnwfbewfubdsijn') {
      numberToLoad = 20;
    }
    this.loadQuestions(2, numberToLoad, () => {
      this.logInteraction('moreQuestionsButton');
      if (this.state.search.length >= 3 && this.state.search !== 'dwdnwfbewfubdsijn') {
        this.filterQuestions(this.state.search);
      }
    });
  }

  toggleForm() {
    this.logInteraction(this.state.expanded ? 'questionFormClose' : 'addQuestionButton');
    this.setState({
      expanded: !this.state.expanded
    });
  }

  checkQuery(questionObject, query) {
    if (questionObject.question_body.split(new RegExp(query, 'i')).length > 1) {
      return true;
    }
    var answers = Object.keys(questionObject.answers).map((key) => questionObject.answers[key]);
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].body.split(new RegExp(query, 'i')).length > 1) {
        return true;
      }
    }
    return false;
  }

  render() {
    return (
      <div id="questionsBody">
        <h3 id="questionsHeader">QUESTIONS &#38; ANSWERS</h3>
        <QuestionSearch handleSearch={this.handleSearch} logInteraction={this.logInteraction}/>
        {this.state.dataReceived &&
          <div id="questionList">
            {this.state.questions.map(question =>
              <QuestionBody key={Math.random()} questionObject={question} search={this.state.search} logInteraction={this.logInteraction}/>
            )}
          </div>
        }
        <div className="qaWidgetButtonRow">
          {!this.state.allLoaded &&
            <h4 className="qaWidgetButton" onClick={this.loadMore}>MORE ANSWERED QUESTIONS</h4>
          }
          <h4 className="qaWidgetButton" onClick={this.toggleForm}>ADD A QUESTION &nbsp;&#43;</h4>
        </div>
        {this.state.expanded &&
          <div className="addQuestionDiv">
            <div className="questionFormBox">
              <QuestionForm close={this.toggleForm} productId={this.props.productId} logInteraction={this.logInteraction}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Questions;