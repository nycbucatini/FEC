import React from 'react';
//this.props.skus - each sku key has object with properties quantity and size
//this.props.selectSku(sku)
const RIGHT_PANEL_WIDTH = 0.3 * window.innerWidth;
const css = {
  width: RIGHT_PANEL_WIDTH * 0.55,
  paddingLeft: 0.03 * RIGHT_PANEL_WIDTH,
  height: 0.1 * RIGHT_PANEL_WIDTH,
  borderRadius: 0,
  fontFamily: 'Verdana',
  marginTop: 0.02 * RIGHT_PANEL_WIDTH,
  fontWeight: 'bold',
  border: 'solid 1px',
  color: '#555555'
};
class SelectSize extends React.Component {
  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this.state = {
      value: 'none'
    };
  }

  _onChange(event) {
    this.props.selectSku(event.target.value);
    this.setState({
      value: event.target.value
    });
  }

  render() {
    var optionTags = [];
    for (var key in this.props.skus) {
      if (this.props.skus[key].quantity > 0) {
        optionTags.push(<option value={key}>{this.props.skus[key].size}</option>);
      }
    }
    optionTags.unshift(<option value='none' disabled>{optionTags.length > 0 ? 'SELECT SIZE' : 'OUT OF STOCK'}</option>);
    return (
      <select id="selectSize" style={css} value={this.state.value} onChange={this._onChange}>
        {optionTags}
      </select>
    );

  }
}
export default SelectSize;