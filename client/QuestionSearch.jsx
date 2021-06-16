import React from 'react';

//this.props.handleSearch(query)
class QuestionSearch extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: ''
    };
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    }, () => {
        this.props.handleSearch(this.state.value);
    });
  }



  render() {
    return (
      <input id="questionSearch" type="text" placeholder="Search for answers" value={this.state.value} onChange={this.handleChange} onClick={() =>{this.props.logInteraction('questionSearch')}}/>
    );
  }
}
export default QuestionSearch;