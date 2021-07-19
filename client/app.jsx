import React from 'react';
import ReactDOM from 'react-dom';
import ProductDetail from './ProductDetail/ProductDetail.jsx';
import ReviewRating from './ReviewRating/ReviewRating.jsx';
import Questions from './Questions/Questions.jsx';
import ProductReviewBody from './ProductReviewBody/ProductReviewBody.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getProductId = this.getProductId.bind(this);
    this.getReviewImage = this.getReviewImage.bind(this);

    this.state = {

    };
  }

  getProductId () {
    return parseInt(window.location.pathname.slice(9));
  }

  //pass in number between 1 and 5. Pass in zero if no reviews.
  //Images are 150 * 30. I recommend sizing these down to 75 * 15 using CSS.
  getReviewImage(rating) {
    var images = {
      0: 'https://i.ibb.co/mc2Fh55/00Star.png',
      2: 'https://i.ibb.co/kQwfftD/10Star.png',
      3: 'https://i.ibb.co/BP4WJBs/15Star.png',
      4: 'https://i.ibb.co/YB9kMjb/20Star.png',
      5: 'https://i.ibb.co/5FChKj1/25Star.png',
      6: 'https://i.ibb.co/nRDFRkG/30Star.png',
      7: 'https://i.ibb.co/QPhsBY5/35Star.png',
      8: 'https://i.ibb.co/kK3wbmY/40Star.png',
      9: 'https://i.ibb.co/9pG8cNS/45Star.png',
      10: 'https://i.ibb.co/Jr5z49c/50Star.png'
    };

    var key = Math.ceil(rating * 2);
    return images[key];
  }

  render() {

    //pass this to your component as a prop!
    var productId = this.getProductId();

    return (

      //put your components in the div!
      <React.Fragment>
        <ProductDetail productId={productId} getReviewImage={this.getReviewImage}/>
        <ProductReviewBody productId={productId}  stars={this.getReviewImage}/>
        <Questions productId={productId}/>
        <ReviewRating productId={productId}/>

      </React.Fragment>
    );
  }
}
ReactDOM.render(<App /> , document.getElementById('app'));