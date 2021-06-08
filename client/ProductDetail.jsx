import DefaultGallery from './DefaultGallery.jsx';
import ExpandedGallery from './ExpandedGallery.jsx';
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
    this.loadStyles = this.loadStyles.bind(this);

    this.switchGallery = this.switchGallery.bind(this);

    this.state = {
      category: '',
      name: '',
      price: '',
      description: '',
      slogan: '',

      styles: [],
      currentStyle: undefined,
      currentPhotoIndex: 0,
      expanded: false,

      dataReceived: false
    };
  }

  componentDidMount() {
    // window.addEventListener('storage', function(e) {
    //   var newOutfitList = Object.keys(window.localStorage);
    //   console.log(newOutfitList);
    // }.bind(this));

    // window.localStorage.setItem('11002', 'saved');
    // var event = new Event('storage');
    // window.dispatchEvent(event);


    this.loadBasicInfo();
    this.loadStyles();

  }

  loadBasicInfo() {
    axios.get(API_ROOT + `/products/${this.props.productId}`, HEADERS)
      .then((response) => {
        console.log('Line 34', response.data);
        var infopacket = response.data;
        this.setState({
          category: infopacket.category,
          name: infopacket.name,
          price: infopacket.default_price,
          description: infopacket.description,
          slogan: infopacket.slogan
        });
      })
      .catch((err) => {
        console.log('darn');
      });
  }

  loadStyles() {
    axios.get(API_ROOT + `/products/${this.props.productId}/styles`, HEADERS)
      .then((response) => {
        console.log('Line 52', response.data);
        var styles = response.data.results;
        var currentStyle = styles[0];
        for (var i = 0; i < styles.length; i++) {
          if (styles[i]['default?'] === true ) {
            currentStyle = styles[i];
          }
        }
        this.setState({
          styles: styles,
          currentStyle: currentStyle,
          dataReceived: true
        });
      })
      .catch((err) => {
        console.log(darn);
      });
  }

  switchGallery(index) {
    this.setState({
      currentPhotoIndex: index,
      expanded: !this.state.expanded
    });
  }

  render() {
    return (
      <div>
        {this.state.dataReceived && !this.state.expanded &&
          <DefaultGallery photos={this.state.currentStyle.photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex}/>
        }
        {this.state.dataReceived && this.state.expanded &&
          <ExpandedGallery photos={this.state.currentStyle.photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex}/>
        }
        {!this.state.expanded &&
          <div>
            <h3>{this.state.name}</h3>
            <p>{this.state.category}</p>
            <p>{this.state.price}</p>
            <p>{this.state.slogan}</p>
            <p>{this.state.description}</p>
          </div>
        }

      </div>

    );
  }
}

export default ProductDetail;