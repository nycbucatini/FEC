import React from 'react';
import axios from 'axios';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
//https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/products?count=10
const HEADERS = {
  headers: {
    'Authorization' : KEY
  }
};

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);

    this.loadBasicInfo = this.loadBasicInfo.bind(this);

    this.state = {
      category: '',
      name: '',
      price: '',
      description: '',
      slogan: ''
    };
  }

  componentDidMount() {
    this.loadBasicInfo();
  }

  loadBasicInfo() {
    axios.get(API_ROOT + `/products/${this.props.productId}`, HEADERS)
      .then((response) => {
        console.log(response.data);
        var infopacket = response.data;
        this.setState({
          category: infopacket.category,
          name: infopacket.name,
          price: infopacket.price,
          description: infopacket.description,
          slogan: infopacket.slogan
        });
      })
      .catch((err) => {
        console.log('darn');
      });
  }

  render() {
    return (
      <div>
        <h3>{this.state.name}</h3>
        <p>{this.state.category}</p>
        <p>{this.state.price}</p>
        <p>{this.state.slogan}</p>
        <p>{this.state.description}</p>
      </div>
    );
  }
}

export default ProductDetail;