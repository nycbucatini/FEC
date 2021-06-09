import DefaultGallery from './DefaultGallery.jsx';
import ExpandedGallery from './ExpandedGallery.jsx';
import StyleIcon from './StyleIcon.jsx';
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
  height: HEIGHT -1.5 * TOP_OFFSET,
  backgroundColor: '#ffffff',
  marginTop: 0,
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

    this.state = {
      rating: 5,
      category: '',
      name: '',
      description: '',
      slogan: '',

      styles: [],
      currentStyleIndex: 0,
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

  switchGallery(index) {
    this.setState({
      currentPhotoIndex: index,
      expanded: !this.state.expanded
    });
  }

  changeStyle(index) {
    this.setState({
      currentStyleIndex: index,
      currentPhotoIndex: 0
    });
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
          <DefaultGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex}/>
        }
        {this.state.dataReceived && this.state.expanded &&
          <ExpandedGallery photos={this.state.styles[this.state.currentStyleIndex].photos} switchGallery={this.switchGallery} startingIndex={this.state.currentPhotoIndex}/>
        }
        {!this.state.expanded && this.state.dataReceived &&
          <div id="rightPanel" style={rightPanelCSS}>
            <div id="productInfoReviewStar"style={{display: 'flex', alignItems: 'center'}}>
              <img style={{width: 75, height: 15}} src={starsURL}/>
              <a href="/" style={{fontFamily: 'Verdana', fontSize: 12, color: 'black', marginLeft: 10}}>Read All Reviews</a>
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
            <div id="styleIcons" style={{width: RIGHT_PANEL_WIDTH * 0.8, display: 'flex', flexFlow: 'row wrap', justifyContent: 'flex-start', alignContent: 'flex-start', alignItems: 'center'}}>
              {styleIconComponents}
            </div>
            {/* <p>{this.state.slogan}</p>
            <p>{this.state.description}</p> */}
          </div>
        }

      </div>

    );
  }
}

export default ProductDetail;