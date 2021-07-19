
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
class CompareBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameLeft: '',
      nameRight: '',
      priceLeft: 0,
      riceRight: 0,
      tuples: []
    };
    this.getFeatures = this.getFeatures.bind(this);
  }

  getFeatures (productId) {
    return axios.get(API_ROOT + `/products/${productId}`, HEADERS)
      .then((response) => {
        console.log("THIS IS PROPS INFO", this.props.info);
        if (productId === this.props.info) {
          this.setState({
            nameLeft: response.data.name,
            priceLeft: response.data.default_price
          });
        } else {
          this.setState({
            nameRight: response.data.name,
            priceRight: response.data.default_price
          });
        }
        return response.data.features
      });
  }

  componentDidMount() {
    var promises = [];
    promises.push(this.getFeatures(this.props.info));
    promises.push(this.getFeatures(parseInt(window.location.pathname.slice(9))));
    Promise.all(promises)
    .then ((responses) => {
      // console.log("THESE ARE PROMISE RESULTS",responses)
      var featuresBottom = responses[0];
      var featuresTop = responses[1];
      var cleanerBottom = {};
      var cleanerTop = {};
      for (var x = 0; x < featuresBottom.length; x++) {
        cleanerBottom[featuresBottom[x].feature] = featuresBottom[x].value;
      }
      for (var x = 0; x < featuresTop.length; x++) {
        cleanerTop[featuresTop[x].feature] = featuresTop[x].value;
      }
      // console.log("CLEANER TOP OBJECT",cleanerTop)
      var allKeys = Object.keys(cleanerBottom).concat(Object.keys(cleanerTop));
      allKeys = Array.from(new Set(allKeys));
      // console.log("ALL KEYS OBJECT TOP BOTTOM", allKeys)

      var tuples = [];

      for (var x = 0; x < allKeys.length; x++) {
        var feature = allKeys[x];
        if (cleanerBottom[feature] && cleanerTop[feature]) {
          var bottomLeft = cleanerBottom[feature] + ' ' + feature;
          var topRight = cleanerTop[feature] + ' ' + feature;
          tuples.unshift([bottomLeft, topRight]);
          continue;
        }
        if (cleanerBottom[feature]) {
          var bottomLeft = cleanerBottom[feature] + ' ' + feature;
          var topRight = " ";
          tuples.push([bottomLeft, topRight]);
          continue;
        }
        if (cleanerTop[feature]) {
          var bottomLeft = " ";
          var topRight = cleanerTop[feature] + ' ' + feature;
          tuples.push([bottomLeft, topRight]);
          continue;
        }
      }
      console.log("TUPLES", tuples)
      this.setState({
        tuples: tuples
      });
    });
  }

  render () {
    return (
    <div class='transparentCompareBox'>
      <div class='compareBox'>
        <svg id="questionFormClose"
        style={{zIndex: 5, position: 'fixed', top: '17%', left: '85%', cursor: 'pointer'}} width={36} height={36} onClick={this.props.close} data-name="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M72 11.77L60.23 0 36 24.23 11.77 0 0 11.77 24.23 36 0 60.23 11.77 72 36 47.77 60.23 72 72 60.23 47.77 36 72 11.77z"/></svg>
        <div class='compareInfo' >
          <div class='nameCompare'>
            <p class='compareHeader'>
              {this.state.nameLeft}
            </p>
            <p class='compareHeader'>
              {this.state.nameRight}
            </p>
          </div>
          <div class='priceCompare'>
            <p class='priceHeader'>
              {'$' + this.state.priceLeft}
            </p>
            <p class='priceHeader'>
              {'$' + this.state.priceRight}
            </p>
          </div>
            {this.state.tuples.map(row =>
              <div class='compareInfoRow' >
                  <p class='compareInfoText'>
                    {row[0]}
                  </p>
                  <p class='compareInfoText'>
                    {row[1]}
                  </p>
              </div>
            )}
        </div>
      </div>
    </div>
    );
  }
}
export default CompareBox;