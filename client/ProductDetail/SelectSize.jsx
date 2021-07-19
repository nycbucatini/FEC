import React from 'react';
//this.props.skus - each sku key has object with properties quantity and size
//this.props.selectSku(sku)

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
      <select id="selectSize" value={this.state.value} onChange={this._onChange}>
        {optionTags}
      </select>
    );

  }
}
export default SelectSize;