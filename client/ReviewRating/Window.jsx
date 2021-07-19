import React from 'react';
import Modal from './Modal.jsx'
import RadioModal from './RadioModal.jsx'
export default class Window extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      blankStar: ['star fa fa-star fa-lg 1' , 'star fa fa-star fa-lg 2', 'star fa fa-star fa-lg 3','star fa fa-star fa-lg 4', 'star fa fa-star fa-lg 5'],
      star: 0
    }
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onClickStyleStar = this.onClickStyleStar.bind(this);
  }

  showModal() {
    this.setState({show: true});
  }

  hideModal() {
    this.setState({show: false});
  }

  onClickStyleStar(e) {
      let sliceStar = this.state.blankStar.slice();
      let currentStar = Number(e.target.classList[4]);

      this.setState({blankStar: sliceStar}, () => {
      let currentIndex = currentStar - 1;
      let starsLeft = this.state.blankStar.length - currentStar;
      let wholeArray = [];
      let newArray = [];

      for (var i = 0; i <= currentIndex; i++) {
        wholeArray.push(sliceStar[i] + ' star-whole');
      }
      for (var j = currentIndex + 2; j <= 5; j++) {
        newArray.push(`star fa fa-star fa-lg ${j}`);
      }
      this.setState({star: wholeArray.length})
      const concatArray = wholeArray.concat(newArray)
      this.setState({blankStar: concatArray});
    })

  }
  render() {

    return (
      <div className='two-Button-child2'>
        <Modal show={this.state.show} handleClose={this.hideModal}>
        <h1 className='write-review-h1'>Write Your Review</h1>
        <hr></hr>
        <div className='overall-rating'>

        <div>
        <h4>Overall Rating</h4>
        </div>

        <div className='rated-by-stars'>
        {this.state.blankStar.map((star) => {
          return(
          <span onClick={this.onClickStyleStar} className={star}>
          </span>
          );
        })}
        </div>

        </div>
        <RadioModal comfortId={this.props.comfortId} fitId={this.props.fitId} LengthId={this.props.LengthId} QualityId={this.props.QualityId} productId={this.props.productId} rating={this.state.star}/>

        </Modal>
        <button type="button" onClick={this.showModal}>
          <p className='button-addReview'>ADD A REVIEW +</p>
        </button>
      </div>
    );
  }
}