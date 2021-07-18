import React from 'react';
import ProductReviewItem from './ProductReviewItem.jsx';
import axios from 'axios';
import KEY from '../config.js';
const API_ROOT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc';
//https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/products?count=10
const HEADERS = {
  headers: {
    'Authorization' : KEY
  }
};

class ProductReviewGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allProducts: [],
      productsShowing: [],
      currentIndex: 0
    };
    this.loadRelatedProducts = this.loadRelatedProducts.bind(this);
    this.cycleLeft = this.cycleLeft.bind(this);
    this.cycleRight = this.cycleRight.bind(this);
  }

  loadRelatedProducts() {
    return axios.get(API_ROOT + `/products/${this.props.productId}/related`, HEADERS)
      .then((response) => {
        console.log("THIS IS RESPONSE DATA", response.data)
        var unique = Array.from(new Set(response.data));
        // console.log("THIS IS UNIQUE ARRAY", unique);
        this.setState({
          allProducts: unique,
          productsShowing: unique.slice(0,4)
        });
      });
  }

  cycleLeft() {
    var newIndex = this.state.currentIndex - 1;
    if (newIndex < 0) {
      newIndex= this.state.allProducts.length-1;
    };
    var newLineup = this.state.allProducts.concat(this.state.allProducts).slice(newIndex, newIndex + Math.min(this.state.allProducts.length, 4));
    console.log("THIS IS CYCLELEFT", newLineup);
    this.setState({productsShowing: newLineup, currentIndex: newIndex});
  }
  cycleRight() {
    var newIndex = this.state.currentIndex + 1;
    newIndex %= this.state.allProducts.length;
    var newLineup = this.state.allProducts.concat(this.state.allProducts).slice(newIndex, newIndex + Math.min(this.state.allProducts.length, 4));
    this.setState({productsShowing: newLineup, currentIndex: newIndex});
  }

  componentDidMount() {
    this.loadRelatedProducts();
  }


  render() {
    return (
      <div className="Related-Product-Gallery">
        <img class='relatedProductLeftArrow' src={'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181109954/111879652-left-arrow-vector-icon-isolated-on-transparent-background-left-arrow-transparency-logo-concept.jpg'} onClick={this.cycleLeft} />
          {this.state.productsShowing.map (product =>
          <ProductReviewItem key={Math.random()} productId={product} stars={this.props.stars}/>
          )}
        <img class='relatedProductRightArrow' src={'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181109660/111791312-right-arrow-vector-icon-isolated-on-transparent-background-right-arrow-transparency-logo-concept.jpg'} onClick={this.cycleRight}/>
      </div>
    );
  }
}
export default ProductReviewGallery;