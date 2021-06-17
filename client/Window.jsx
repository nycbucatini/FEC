import React from 'react';
import Modal from './Modal.jsx'
import RadioModal from './RadioModal.jsx'
export default class Window extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      blankStar: ['star fa fa-star fa-xs 1' , 'star fa fa-star fa-xs 2', 'star fa fa-star fa-xs 3','star fa fa-star fa-xs 4', 'star fa fa-star fa-xs 5'],
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
        newArray.push(`star fa fa-star fa-xs ${j}`);
        // console.log('newArray 2nd loop ****', newArray);
      }
      const concatArray = wholeArray.concat(newArray)
      // console.log('wholeArray after concat', concatArray);
      this.setState({blankStar: concatArray});
    })

  }
  render() {
    console.log('props passed to window.jsx ***', this.props.comfortId);

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
        <RadioModal comfortId={this.props.comfortId} fitId={this.props.fitId} LengthId={this.props.LengthId} QualityId={this.props.QualityId}/>

        </Modal>
        <button type="button" onClick={this.showModal}>
          <p className='button-addReview'>ADD A REVIEW +</p>
        </button>
      </div>
    );
  }
}