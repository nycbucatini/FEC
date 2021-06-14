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
      if (this.state.value.length >= 3) {
        this.props.handleSearch(this.state.value);
      }
    });
  }

  render() {
    return (
      <input id="questionSearch" type="text" placeholder="Search for answers" value={this.state.value} onChange={this.handleChange} />
    );
  }
}
export default QuestionSearch;