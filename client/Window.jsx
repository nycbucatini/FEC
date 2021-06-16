import React from 'react';
import Modal from './Modal.jsx'

export default class Window extends React.Component {
  constructor() {
    super()
    this.state = {
      show: false,
      blankStar: ['star fa fa-star fa-xs 1' , 'star fa fa-star fa-xs 2', 'star fa fa-star fa-xs 3','star fa fa-star fa-xs 4', 'star fa fa-star fa-xs 5']
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
    // let currentValue = e.target.classList[4]
    // ex. fa-rate-4 --> 4 = i , any value less than or equal to 4 we apply whole star css.
    // add the className .star-whole to it

    // if i clicked on the 4th star the value would be '4'
    // so 4th star and everything to the left of it should be colored in.

    // we can use the index in the array to track which one to add the className into it
      // ex: 4th star is index 3 , everything less than equal to 3rd index would apply color to it
      let sliceStar = this.state.blankStar.slice();
      let currentStar = Number(e.target.classList[4]);
    this.setState({blankStar: sliceStar}, () => {
      // if clicked on 4th star , corresponding index on array is 3.
      // left over star should be 1.
      let currentIndex = currentStar - 1;
      // which is always gonna be 5 stars - the clicked star ex: if clicked on 4th star
      // it's 5 - 4 --> 1 stars left.
      let starsLeft = this.state.blankStar.length - currentStar;
      let wholeArray = [];
      let newArray = [];
      // i could be > or = 0
      // when clicked on that star it should include itself and everythign to the left.
      for (var i = 0; i <= currentIndex; i++) {
        wholeArray.push(sliceStar[i] + ' star-whole');
      }
      // console.log('newArray after first loop', wholeArray);
      // if clicked on 4th star , currentIndex = 3
      // console.log('what is the currentIndex', currentIndex);
      for (var j = currentIndex + 2; j <= 5; j++) {
        newArray.push(`star fa fa-star fa-xs ${j}`);
        // console.log('newArray 2nd loop ****', newArray);
      }
      const concatArray = wholeArray.concat(newArray)
      // console.log('wholeArray after concat', concatArray);
      this.setState({blankStar: concatArray});
    })

  }
  render() {
    return (
      <div className='two-Button-child2'>
        <Modal show={this.state.show} handleClose={this.hideModal}>
        <h1>Title</h1>
        <h2>sub-title</h2>
        <hr></hr>
        <div className='overall-rating'>

        <div>
        <p>Overall Rating</p>
        </div>

        <div className='rated-by-stars'>
        {/* if clicked on fa-rate-3 then we want 3 whole stars , 2 non solid */}
        {/* for i < current */}
        {/* <span className='star fa fa-star fa-xs fa-rate-1'></span>
        <span className='star fa fa-star fa-xs fa-rate-2'></span>
        <span className='star fa fa-star fa-xs fa-rate-3'></span>
        <span className='star fa fa-star fa-xs fa-rate-4'></span>
        <span className='star fa fa-star fa-xs fa-rate-5'></span> */}
        {this.state.blankStar.map((star) => {
          return(
          <span onClick={this.onClickStyleStar} className={star}>
          </span>
          );
        })}
        </div>

        </div>

        </Modal>
        <button type="button" onClick={this.showModal}>
          <p className='button-addReview'>ADD A REVIEW +</p>
        </button>
      </div>
    );
  }
}