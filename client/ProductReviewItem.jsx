
import React from 'react';
import axios from 'axios';
import KEY from '../config.js';
import CompareBox from './CompareBox.jsx';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
//https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/products?count=10
const HEADERS = {
  headers: {
    'Authorization' : KEY
  }
};
//this.props.productId
class ProductReviewItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      category: '',
      photo: '',
      name: '',
      price: 0,
      rating: 5,

      popUp: false,
    };

    this.getPhoto = this.getPhoto.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.starClick = this.starClick.bind(this);
    this.getRating = this.getRating.bind(this);
    this.popUp = this.popUp.bind(this);
    this.popUpClose = this.popUpClose.bind(this);
  }

  getPhoto () {
    return axios.get(API_ROOT + `/products/${this.props.productId}/styles`, HEADERS)
    .then((response) => {
      // console.log("THIS IS STYLES DATA", response.data.results[0].photos[0].thumbnail_url)
      this.setState({
        photo: response.data.results[0].photos[0].thumbnail_url
      });
    });
  }

  getInfo () {
    return axios.get(API_ROOT + `/products/${this.props.productId}`, HEADERS)
    .then((response) => {
      // console.log("THIS IS PRODUCT DATA", response.data)
      this.setState({
        category: response.data.category,
        name: response.data.name,
        price: response.data.default_price
      });
    });
  }

  getRating() {
    return axios.get(API_ROOT + `/reviews/meta/?product_id=${this.props.productId}`, HEADERS)
      .then((response) => {
        console.log('GET RATING', response.data);

        var parseHelper = function(input) {
          var output = parseInt(input);
          return isNaN(output) ? 0 : output;
        };
        var ratingsObject = response.data.ratings;
        var ratingCount = parseHelper(ratingsObject['1']) + parseHelper(ratingsObject['2']) + parseHelper(ratingsObject['3']) + parseHelper(ratingsObject['4']) + parseHelper(ratingsObject['5']);
        var ratingSum = parseHelper(ratingsObject['1']) + 2 * parseHelper(ratingsObject['2']) + 3 * parseHelper(ratingsObject['3']) + 4 * parseHelper(ratingsObject['4']) + 5 * parseHelper(ratingsObject['5']);
        var average = ratingSum / ratingCount;
        this.setState({
          rating: isNaN(average) ? 0 : average
        });
      })
      .catch((err) => {
        console.log('oops');
      });
  }



  starClick() {
    window.localStorage.setItem(this.props.productId, 'saved');
    var event = new Event('storage');
    window.dispatchEvent(event);
    alert('Product Saved To Outfits' + this.props.productId);
  }

  popUp() {
    this.setState({
      popUp:true
    });
  }

  popUpClose() {
    this.setState({
      popUp:false
    });
  }

  componentDidMount () {
    this.getPhoto();
    this.getInfo();
    this.getRating();
  }

render() {
  return (
    <div class='relatedProductBox'>
      <img class='product-photo' src={this.state.photo} />
      <img class='product-star' src={'https://png.pngtree.com/png-clipart/20190705/original/pngtree-vector-star-icon-png-image_4187383.jpg'} onClick={this.starClick}/>
      <p class='relatedProductCategory'>
        {this.state.category}
      </p>
      <a class='relatedProductName' href={`/product/${this.props.productId}`}>
        {this.state.name}
      </a>
      <p class='relatedProductPrice'>
        {this.state.price}
      </p>
        <img class='relatedProductsStar' src={this.props.stars(this.state.rating)} />
      <button class='compareButton' onClick={this.popUp}> compare  </button>
      {this.state.popUp &&
        <CompareBox info={this.props.productId} close={this.popUpClose}/> }
    </div>
    );
  }
}
export default ProductReviewItem;