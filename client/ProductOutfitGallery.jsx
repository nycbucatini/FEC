import React from 'react';
import ProductOutfitItem from './ProductOutfitItem.jsx';

//this.props.questionObject
class ProductOutfitGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allProducts: [],
      productsShowing: [],
      currentIndex: 0
    };
    this.loadOutfits = this.loadOutfits.bind(this);
    this.cycleLeft = this.cycleLeft.bind(this);
    this.cycleRight = this.cycleRight.bind(this);
  }

  loadOutfits() {
    // console.log("THIS IS LOCAL STORAGE", Object.keys(window.localStorage) )
    var storage = Object.keys(window.localStorage);
    this.setState({
      allProducts: storage.slice(),
      productsShowing: storage.slice(0,4)

    });
  }

  cycleLeft() {
    var newIndex = this.state.currentIndex - 1;
    if (newIndex < 0) {
      newIndex= this.state.allProducts.length - 1;
    }
    var newLineup = this.state.allProducts.concat(this.state.allProducts).slice(newIndex, newIndex + Math.min(this.state.allProducts.length, 4));
    // console.log("THIS IS CYCLELEFT", newLineup);
    this.setState({
      productsShowing: newLineup,
      currentIndex: newIndex
    });
  }
  cycleRight() {
    var newIndex = this.state.currentIndex + 1;
    newIndex %= this.state.allProducts.length;
    var newLineup = this.state.allProducts.concat(this.state.allProducts).slice(newIndex, newIndex + Math.min(this.state.allProducts.length, 4));
    this.setState({
      productsShowing: newLineup,
      currentIndex: newIndex
    });
  }

  componentDidMount() {
    this.loadOutfits();
    window.addEventListener('storage', function(e) {
      var newOutfitList = Object.keys(window.localStorage);
      // console.log("STORAGE CHANGED", newOutfitList);
      this.setState({
        allProducts: newOutfitList,
        productsShowing: newOutfitList.slice(0,4)
      });
    }.bind(this));

  };


  render() {
    return (
      <div className="Related-Product-Gallery">
         <img class='relatedProductLeftArrow' src={'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181109954/111879652-left-arrow-vector-icon-isolated-on-transparent-background-left-arrow-transparency-logo-concept.jpg'} onClick={this.cycleLeft}/>
        {this.state.productsShowing.map (product =>
        <ProductOutfitItem productId={product}
        stars={this.props.stars}
        key={Math.random()}
        />
        )}
         <img class='relatedProductRightArrow' src={'https://previews.123rf.com/images/eljanstock/eljanstock1811/eljanstock181109660/111791312-right-arrow-vector-icon-isolated-on-transparent-background-right-arrow-transparency-logo-concept.jpg'} onClick={this.cycleRight}/>
      </div>
    );
  }
}

export default ProductOutfitGallery;