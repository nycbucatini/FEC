import React from 'react';
//this.props.quantity - disable if undefined or 0
//this.props.selectQuantity(quantity)
const RIGHT_PANEL_WIDTH = 0.3 * window.innerWidth;
const css = {
  width: RIGHT_PANEL_WIDTH * 0.2,
  height: 0.1 * RIGHT_PANEL_WIDTH,
  marginLeft: 0.04 * RIGHT_PANEL_WIDTH,
  paddingLeft: 0.03 * RIGHT_PANEL_WIDTH,
  marginTop: 0.02 * RIGHT_PANEL_WIDTH,
  borderRadius: 0,
  border: 'solid 1px',
  color: '#555555',
  fontFamily: 'Verdana',
  fontWeight: 'bold'
};
class SelectQuantity extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this.state = {
      value: 1
    };
  }

  _onChange(event) {
    var q = parseInt(event.target.value)
    if (isNaN(q) || !q) {
      q = 0;
    }
    this.props.selectQuantity(q);
    this.setState({
      value: event.target.value
    });
  }

  render() {
    var optionTags = [];
    if (!this.props.quantity) {
      optionTags.push(<option value={1} disabled>-</option>);
    } else {
      for (var i = 1; i <= this.props.quantity && i <= 15; i++) {
        optionTags.push(<option value={i}>{i}</option>);
      }
    }

    return (
      <select id="selectQuantity" style={css} value={this.state.value} onChange={this._onChange}>
          {optionTags}
      </select>
    );
  }
}
export default SelectQuantity;