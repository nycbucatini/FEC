// var isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
import DefaultGallery from './DefaultGallery.jsx';
import ExpandedGallery from './ExpandedGallery.jsx';
import StyleIcon from './StyleIcon.jsx';
import SelectSize from './SelectSize.jsx';
import SelectQuantity from './SelectQuantity.jsx';
import React from 'react';
import axios from 'axios';
import KEY from '../../config.js';
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
    this.loadReviews = this.loadReviews.bind(this);

    this.switchGallery = this.switchGallery.bind(this);
    this.disableScroll = this.disableScroll.bind(this);
    this.enableScroll = this.enableScroll.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.selectSku = this.selectSku.bind(this);
    this.selectQuantity = this.selectQuantity.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addOutfit = this.addOutfit.bind(this);
    this.logInteraction = this.logInteraction.bind(this);
    this.scrollToReviews = this.scrollToReviews.bind(this);

    this.state = {
      rating: 5,
      category: '',
      name: '',
      description: '',
      slogan: '',
      features: [],

      styles: [],
      currentStyleIndex: 0,
      currentPhotoIndex: 0,
      selectedSku: 'none',
      quantity: 0,
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

    var loadPromises = [];
    loadPromises.push(this.loadBasicInfo());
    loadPromises.push(this.loadStyles());
    loadPromises.push(this.loadReviews());
    Promise.all(loadPromises)
      .then(() => {
        this.setState({
          dataReceived: true
        });
      })
      .catch((err) => {
        console.log('something failed to load');
      })
  }

  loadBasicInfo() {
    return axios.get(API_ROOT + `/products/${this.props.productId}`, HEADERS)
      .then((response) => {
        console.log('LoadBasicInfo()', response.data);
        var infopacket = response.data;
        var parseFeatures = function(input) {
          var output = [];
          for (var i = 0; i < input.length; i++) {
            var value = input[i].value ? input[i].value : '';
            var feature = input[i].feature ? input[i].feature : '';
            output.push(`✓ ${value} ${feature}`);
          }
          return output;
        }
        var features = parseFeatures(infopacket.features);
        this.setState({
          category: infopacket.category,
          name: infopacket.name,
          price: infopacket.default_price,
          description: infopacket.description,
          slogan: infopacket.slogan,
          features: features
        });
      })
      .catch((err) => {
        console.log('darn');
      });
  }

  loadStyles() {
    return axios.get(API_ROOT + `/products/${this.props.productId}/styles`, HEADERS)
      .then((response) => {
        console.log('LoadStyles()', response.data);
        var styles = response.data.results;
        var currentIndex = 0;
        for (var i = 0; i < styles.length; i++) {
          if (styles[i]['default?'] === true ) {
            currentIndex = i;
          }
        }
        // currentStyle = styles[2]; ///delete this line!
        this.setState({
          styles: styles,
          currentStyleIndex: currentIndex,
          price: styles[currentIndex].original_price,
          salePrice: styles[currentIndex].sale_price,
        });
      })
      .catch((err) => {
        console.log(darn);
      });
  }

  loadReviews() {
    return axios.get(API_ROOT + `/reviews/meta/?product_id=${this.props.productId}`, HEADERS)
      .then((response) => {
        console.log('LoadReviews()', response.data);

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

  logInteraction(element) {
    return axios.post(API_ROOT + '/interactions', {
      element: element,
      widget: 'ProductDetail',
      time: Date.now().toString()
    }, HEADERS)
      .then((response) => {
        // console.log('Interaction logged ' + element, response);
      })
      .catch((err) => {
        console.log('danggit');
      });
  }

  switchGallery(index) {
    if (this.state.expanded) {
      this.logInteraction('expandedGalleryClose');
    } else {
      this.logInteraction('expandedGalleryOpen');
    }
    this.setState({
      currentPhotoIndex: index,
      expanded: !this.state.expanded
    }, () => {
      // this.state.expanded ? this.disableScroll() : this.enableScroll();
    });
  }

  disableScroll() {
    window.scrollTo(0, 0);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function() {
      window.scrollTo(scrollLeft, scrollTop);
    };
  }

  enableScroll() {
    window.onscroll = function() {};
  }

  changeStyle(index) {
    this.logInteraction('styleIcons');
    this.setState({
      currentStyleIndex: index,
      currentPhotoIndex: 0,
      quantity: 0,
      selectedSku: 'none'
    });
  }

  selectSku(sku) {
    this.logInteraction('selectSize');
    this.setState({
      selectedSku: sku,
      quantity: 1
    });
  }

  selectQuantity(quantity) {
    this.logInteraction('selectQuantity');
    this.setState({
      quantity: quantity
    });
  }

  addToCart() {
    this.logInteraction('bagButton');
    if (this.state.quantity > 0) {
      return axios.post(API_ROOT + '/cart', {
        sku_id: this.state.selectedSku,
        quantity: this.state.quantity
      }, HEADERS)
      .then((response) => {
        alert(`Added ${this.state.quantity} items to cart.`);
        var oldSku = this.state.selectedSku;
        this.setState({
          selectedSku: 'none'
        }, () => {
          this.setState({
            selectedSku: oldSku,
            quantity: 0
          });
        });
      })
      .catch((err) => {
        console.log('oops');
      });
    }
    else {
      alert('Please select a size.');
    }
  }

  addOutfit() {
    window.localStorage.setItem(this.props.productId, 'saved');
    var event = new Event('storage');
    window.dispatchEvent(event);
    this.logInteraction('addOutfitButton');
    alert('Added to saved outfits');
  }

  scrollToReviews() {
    this.logInteraction('reviewLink');
    var element = document.getElementById('reviewsAndRatingsComponent');
    element.scrollIntoView();
  }

  render() {

    var starsURL = this.props.getReviewImage(this.state.rating);
    var styleIconComponents = [];
    for (var i = 0; i < this.state.styles.length; i++) {
      styleIconComponents.push(<StyleIcon icon={this.state.styles[i].photos[0].thumbnail_url} index={i} isSelected={i === this.state.currentStyleIndex} changeStyle={this.changeStyle}/>);
    }

    return (
      <div id="productDetail">
        {this.state.dataReceived && !this.state.expanded &&
          <DefaultGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex} logInteraction={this.logInteraction}/>
        }
        {this.state.dataReceived && this.state.expanded &&
          <ExpandedGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex} logInteraction={this.logInteraction}/>
        }
        {!this.state.expanded && this.state.dataReceived &&
          <div id="rightPanel">
            <div id="productInfoReviewRow">
              <img id="productInfoReviewStars" src={starsURL}/>
              <a id="reviewLink" onClick={this.scrollToReviews}>Read All Reviews</a>
            </div>
            <p id="categoryName">{this.state.category}</p>
            <h2 id="productName">{this.state.name}</h2>
            <div id="prices">
              {this.state.styles[this.state.currentStyleIndex].sale_price &&
                <p id="salePrice">{'$' + Math.floor(this.state.styles[this.state.currentStyleIndex].sale_price) + ' On sale!'}</p>
              }
              <p id={this.state.styles[this.state.currentStyleIndex].sale_price ? 'normalPriceStrikethrough' : 'normalPrice'}>{'$' + Math.floor(this.state.styles[this.state.currentStyleIndex].original_price)}</p>
            </div>
            <div id="stylesHeader">
              <p id="stylesPrompt">STYLE >  </p>
              <p id="selectedStyle">{this.state.styles[this.state.currentStyleIndex].name.toUpperCase()}</p>
            </div>
            <div id="styleIcons">
              {styleIconComponents}
            </div>
            <div id="dropdownRow">
              {/* When the key prop changes, React knows to rerender the dropdown from scratch. Without key prop, React only partially rebuilds the dropdown, which is not ok here! */}
              <SelectSize key={this.state.currentStyleIndex} skus={this.state.styles[this.state.currentStyleIndex].skus} selectSku={this.selectSku}/>
              <SelectQuantity key={this.state.selectedSku + (this.state.quantity === 0 ? 1 : 0)} quantity={this.state.styles[this.state.currentStyleIndex].skus[this.state.selectedSku] ? this.state.styles[this.state.currentStyleIndex].skus[this.state.selectedSku].quantity : 0} selectQuantity={this.selectQuantity}/>
            </div>
            <div id="bagRow">
              <button id="bagButton" onClick={this.addToCart}>ADD TO BAG</button>
              <button id="addOutfitButton" onClick={this.addOutfit}>☆</button>
            </div>
          </div>
        }
        {!this.state.expanded && this.state.dataReceived &&
          <div id="detailPanel">
            <div id="descriptionPanel">
              <h4 id="descriptionHead">{this.state.slogan}</h4>
              <p id="descriptionText">{this.state.description}</p>
            </div>
            <div id="featurePanel">
              <ul id="featureList">
                {this.state.features.map(feature =>
                  <li class="featureItem">{feature}</li>
                )}
              </ul>
            </div>
          </div>
        }
      </div>

    );
  }
}

export default ProductDetail;