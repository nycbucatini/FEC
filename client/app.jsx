import React from 'react';
import ReactDOM from 'react-dom';
import ProductDetail from './ProductDetail.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);

    this.getProductId = this.getProductId.bind(this);

    this.state = {

    };
  }

  getProductId () {
    return parseInt(window.location.pathname.slice(9));
  }

  render() {

    //pass this to your component as a prop!
    var productId = this.getProductId();

    return (

      //put your components in the div!
      <div>

        <ProductDetail productId={productId}/>

      </div>
    );
  }
}
ReactDOM.render(<App /> , document.getElementById('app'));