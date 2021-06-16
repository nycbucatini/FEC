import React from 'react';
class AnswerImage extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      opened: false
    };
  }

  toggle() {
    this.setState({
      opened: !this.state.opened
    });
  }

  render() {
    return (
      <React.Fragment>
      <img className="answerImage" src={this.props.url} onClick={this.toggle}/>
      {this.state.opened &&
      <div>
        <svg id="expandedAnswerClose" style={{zIndex: 10, position: 'fixed', top: '2.5%', left: '95%', cursor: 'pointer'}} width={48} height={48} onClick={this.toggle} data-name="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M72 11.77L60.23 0 36 24.23 11.77 0 0 11.77 24.23 36 0 60.23 11.77 72 36 47.77 60.23 72 72 60.23 47.77 36 72 11.77z"/></svg>
        <img className="expandedAnswerImage" src={this.props.url} onClick={this.toggle} />
      </div>
      }
      </React.Fragment>
    );
  }

};
export default AnswerImage;