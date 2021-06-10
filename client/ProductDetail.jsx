import DefaultGallery from './DefaultGallery.jsx';
import ExpandedGallery from './ExpandedGallery.jsx';
import StyleIcon from './StyleIcon.jsx';
import SelectSize from './SelectSize.jsx';
import SelectQuantity from './SelectQuantity.jsx';
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

const TOP_OFFSET = 50;
const HEIGHT = 0.73 * window.innerHeight;
const RIGHT_PANEL_WIDTH = 0.3 * window.innerWidth;

const rightPanelCSS = {
  position: 'absolute',
  top: TOP_OFFSET,
  left: 0.65 * window.innerWidth,
  width: RIGHT_PANEL_WIDTH,
  height: HEIGHT - 1.5 * TOP_OFFSET,
  backgroundColor: '#ffffff',
  marginTop: 0.05 * window.innerHeight,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start'
};

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);

    this.loadBasicInfo = this.loadBasicInfo.bind(this);
    this.loadStyles = this.loadStyles.bind(this);
    this.loadReviews = this.loadReviews.bind(this);

    this.switchGallery = this.switchGallery.bind(this);
    this.changeStyle = this.changeStyle.bind(this);
    this.selectSku = this.selectSku.bind(this);
    this.selectQuantity = this.selectQuantity.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.addOutfit = this.addOutfit.bind(this);
    this.logInteraction = this.logInteraction.bind(this);

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
    });
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

  render() {

    var starsURL = this.props.getReviewImage(this.state.rating);
    var styleIconComponents = [];
    for (var i = 0; i < this.state.styles.length; i++) {
      styleIconComponents.push(<StyleIcon icon={this.state.styles[i].photos[0].thumbnail_url} index={i} isSelected={i === this.state.currentStyleIndex} changeStyle={this.changeStyle}/>);
    }

    return (
      <div id="productDetail" style={{position: 'relative'}}>
        {this.state.dataReceived && !this.state.expanded &&
          <DefaultGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex} logInteraction={this.logInteraction}/>
        }
        {this.state.dataReceived && this.state.expanded &&
          <ExpandedGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex} logInteraction={this.logInteraction}/>
        }
        {!this.state.expanded && this.state.dataReceived &&
          <div id="rightPanel" style={rightPanelCSS}>
            <div id="productInfoReviewStar"style={{display: 'flex', alignItems: 'center'}}>
              <img style={{width: 75, height: 15}} src={starsURL}/>
              <a href="/" id="reviewLink" onClick={() => {this.logInteraction('reviewLink');}} style={{fontFamily: 'Verdana', fontSize: 12, color: 'black', marginLeft: 10}}>Read All Reviews</a>
            </div>
            <p id="categoryName" style={{fontFamily: 'Verdana', fontWeight: 'lighter', fontVariant: 'small-caps', marginBottom: 0}}>{this.state.category}</p>
            <h2 id="productName" style={{fontFamily: 'Copperplate', marginTop: 0, marginBottom: 0, fontSize: 40 * window.innerHeight / 820}}>{this.state.name}</h2>
            <div id="prices" style={{display: 'flex'}}>
              {this.state.styles[this.state.currentStyleIndex].sale_price &&
                <p style={{color: 'red', fontFamily: 'Verdana', fontVariant: 'small-caps', fontWeight: 'bold', marginRight: 20, marginTop: 10, marginBottom: 0}}>{'$' + Math.floor(this.state.styles[this.state.currentStyleIndex].sale_price) + ' On sale!'}</p>
              }
              <p style={this.state.styles[this.state.currentStyleIndex].sale_price ? {fontFamily: 'Verdana', textDecoration: 'line-through', marginTop: 10, marginBottom: 0} : {fontFamily: 'Verdana', marginTop: 10, marginBottom: 0, fontWeight: 'bold'}}>{'$' + Math.floor(this.state.styles[this.state.currentStyleIndex].original_price)}</p>
            </div>
            <div id="stylesHeader" style={{display: 'flex', alignItems: 'center'}}>
              <p style={{fontFamily: 'Verdana', fontWeight: 'bold'}}>STYLE >  </p>
              <p style={{fontFamily: 'Verdana', marginLeft: 6}}>{this.state.styles[this.state.currentStyleIndex].name.toUpperCase()}</p>
            </div>
            <div id="styleIcons" style={{minHeight: RIGHT_PANEL_WIDTH * 0.45, width: RIGHT_PANEL_WIDTH * 0.8, display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center'}}>
              {styleIconComponents}
            </div>
            <div id="dropdownRow">
              {/* When the key prop changes, React knows to rerender the dropdown from scratch. Without key prop, React only partially rebuilds the dropdown, which is not ok here! */}
              <SelectSize key={this.state.currentStyleIndex} skus={this.state.styles[this.state.currentStyleIndex].skus} selectSku={this.selectSku}/>
              <SelectQuantity key={this.state.selectedSku + (this.state.quantity === 0 ? 1 : 0)} quantity={this.state.styles[this.state.currentStyleIndex].skus[this.state.selectedSku] ? this.state.styles[this.state.currentStyleIndex].skus[this.state.selectedSku].quantity : 0} selectQuantity={this.selectQuantity}/>
            </div>
            <div id="bagRow">
              <button id="bagButton" onClick={this.addToCart} style={{zIndex: 4, width: RIGHT_PANEL_WIDTH * 0.65, height: 0.1 * RIGHT_PANEL_WIDTH, marginTop: 0.04 * RIGHT_PANEL_WIDTH, marginRight: 0.04 * RIGHT_PANEL_WIDTH, backgroundColor: '#ffffff', border: 'solid 1px', fontFamily: 'Verdana', fontWeight: 'bold', color: '#555555'}}>ADD TO BAG</button>
              <button id="addOutfitButton" onClick={this.addOutfit} style={{zIndex: 4, height: 0.1 * RIGHT_PANEL_WIDTH, width: 0.1 * RIGHT_PANEL_WIDTH, borderRadius: 0, backgroundColor: '#ffffff', border: 'solid 1px'}}>☆</button>
            </div>
          </div>
        }
        {!this.state.expanded && this.state.dataReceived &&
          <div id="detailPanel" style={{display: 'flex', position: 'relative', marginTop: 0.1 * window.innerHeight}}>
            <div id="descriptionPanel" style={{position: 'relative', left: 0.12 * window.innerWidth, width: 0.5 * window.innerWidth, paddingRight: 0.015 * window.innerWidth, borderRight: 'solid 2px #222222'}}>
              <h4 style={{fontFamily: 'Verdana', color: '#555555', marginTop: 0}}>{this.state.slogan}</h4>
              <p style={{fontFamily: 'Verdana', fontSize: 15, fontWeight: 'lighter', color: '#222222'}}>{this.state.description}</p>
            </div>
            <div id="featurePanel" style={{position: 'relative', left: .12 * window.innerWidth, paddingLeft: 0.03 * window.innerWidth}}>
              <ul style={{listStyleType: 'none', padding: 0}}>
                {this.state.features.map(feature =>
                  <li style={{fontFamily: 'Verdana', fontVariant: 'small-caps', padding: '2px'}}>{feature}</li>
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