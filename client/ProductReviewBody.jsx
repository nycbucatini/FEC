import React from 'react';
import ProductReviewGallery from './ProductReviewGallery.jsx';
import ProductOutfitGallery from './ProductOutfitGallery.jsx';

//this.props.questionObject
class ProductReviewBody extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.productId,

        photo:'',
        rating: 5,
        category: '',
        name: '',
        description: '',
        price: '',
        starts: [],


      clicked: false
    };
  }


  render() {
    return (
      <div className="Related-Products">
        <h4 class='galleryHeader' > Related Products </h4>
        <ProductReviewGallery productId={this.state.productId} stars={this.props.stars}/>
        <h4 class='galleryHeader' > Your Outfit </h4>
        <ProductOutfitGallery productId={this.state.productId} stars={this.props.stars} />
      </div>

    );
  }
}
export default ProductReviewBody;