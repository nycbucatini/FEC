import React from 'react';

export default class Radio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {selectedOption: null}
    this.handleOptionChange = this.handleOptionChange.bind(this);
}

handleOptionChange(e) {
  this.setState({
    selectedOption: e.target.value
  }, () => {
    this.props.selected(this.props.title, this.state.selectedOption);
  });
}

render() {
  return (
    <div>
    <h4 className='character-title'>{this.props.title}</h4>
      <form className='radio-form'>
          <div className="radio">
          <label>
            <input type="radio" value="1" onChange={this.handleOptionChange} checked={this.state.selectedOption === '1'} />
            {this.props.descriptions[0]}
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="2" onChange={this.handleOptionChange} checked={this.state.selectedOption === '2'}/>
            {this.props.descriptions[1]}

          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="3" onChange={this.handleOptionChange} checked={this.state.selectedOption === '3'}/>
            {this.props.descriptions[2]}
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="4" onChange={this.handleOptionChange} checked={this.state.selectedOption === '4'}/>
            {this.props.descriptions[3]}
          </label>
        </div>
        <div className="radio">
          <label>
            <input type="radio" value="5" onChange={this.handleOptionChange} checked={this.state.selectedOption === '5'}/>
            {this.props.descriptions[4]}
          </label>
        </div>
      </form>
    </div>
  )
}
}