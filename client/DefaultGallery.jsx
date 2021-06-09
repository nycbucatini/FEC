import React from 'react';
import DefaultIconImage from './DefaultIconImage.jsx';

const WIDTH = 0.5 * window.innerWidth;
const HEIGHT = 0.73 * window.innerHeight;
const TOP_OFFSET = 50;
const LEFT_OFFSET = 0.15 * window.innerHeight;
const ICON_COL_WIDTH = 0.15 * window.innerHeight;

const outerCSS = {
  position: 'relative',
  top: TOP_OFFSET,
  left: LEFT_OFFSET,
  height: HEIGHT,
  width: WIDTH,
  backgroundColor: '#ffffff',
};

const imageCSS = {
  objectFit: 'contain',
  width: WIDTH,
  height: HEIGHT,
  cursor: 'zoom-in'
};

const topArrowCSS = {
  position: 'absolute',
  top: TOP_OFFSET,
  left: ICON_COL_WIDTH * -0.7,
  zIndex: 3
};

const downArrowCSS = {
  position: 'absolute',
  top: TOP_OFFSET + HEIGHT - 1.2 * ICON_COL_WIDTH,
  left: ICON_COL_WIDTH * -0.7,
  zIndex: 3
};

const leftArrowCSS = {
  position: 'absolute',
  top: TOP_OFFSET + HEIGHT * 0.375,
  left: LEFT_OFFSET * 0.25
};

const rightArrowCSS = {
  position: 'absolute',
  top: TOP_OFFSET + HEIGHT * 0.375,
  left: WIDTH + ICON_COL_WIDTH * 0.4 - LEFT_OFFSET
};

const iconColCSS = {
  position: 'relative',
  top: TOP_OFFSET - HEIGHT + 0.3 * ICON_COL_WIDTH,
  left: -1 * ICON_COL_WIDTH,
  height: HEIGHT,
  width: ICON_COL_WIDTH,
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  zIndex: 3
}

class DefaultGallery extends React.Component {
  constructor(props) {
    super(props);

    this.iconClicked = this.iconClicked.bind(this);
    this.cycleLeft = this.cycleLeft.bind(this);
    this.cycleRight = this.cycleRight.bind(this);
    this.shiftIconsLeft = this.shiftIconsLeft.bind(this);
    this.shiftIconsRight = this.shiftIconsRight.bind(this);
    this.getIconArray = this.getIconArray.bind(this);
    this.getPhotoIndexFromIconPosition = this.getPhotoIndexFromIconPosition.bind(this);

    this.state = {
      currentIndex: this.props.startingIndex,
      iconIndex: this.props.startingIndex
    };
  }

  iconClicked(index) {
    this.setState({
      currentIndex: index,
      zoomedIn: false
    });
  }

  cycleLeft() {
    var newIndex = this.state.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.props.photos.length - 1;
    }
    var newIconIndex = Math.min(newIndex, this.props.photos.length - 5);
    this.setState({
      currentIndex: newIndex,
      iconIndex: newIconIndex
    });
  }

  cycleRight() {
    var newIndex = (this.state.currentIndex + 1) % this.props.photos.length;
    var newIconIndex = Math.min(newIndex, this.props.photos.length - 5);
    this.setState({
      currentIndex: newIndex,
      iconIndex: newIconIndex
    });
  }

  shiftIconsLeft() {
    var newIndex = this.state.iconIndex - 1;
    if (newIndex < 0) {
      newIndex += this.props.photos.length;
    }
    this.setState({
      iconIndex: newIndex
    });
  }

  shiftIconsRight() {
    var newIndex = this.state.iconIndex + 1;
    newIndex %= this.props.photos.length;
    this.setState({
      iconIndex: newIndex
    });
  }

  getIconArray() {
    var length = this.props.photos.length <= 5 ? this.props.photos.length : 5;
    return this.props.photos.slice(this.state.iconIndex).concat(this.props.photos).slice(0,length);
  }

  getPhotoIndexFromIconPosition(position) {
    return (this.state.iconIndex + position) % this.props.photos.length;
  }

  render() {
    var icons = this.getIconArray();
    var iconComponents = [];
    for (var i = 0; i< icons.length; i++) {
      var index = this.getPhotoIndexFromIconPosition(i);
      iconComponents.push(<DefaultIconImage image={icons[i].thumbnail_url} index={index} isSelected={index === this.state.currentIndex} clickHandler={this.iconClicked}/>);
    }
    return (
      <div style={outerCSS}>
          <img id="defaultImage" style={imageCSS} onClick={() => {this.props.switchGallery(this.state.currentIndex);}} src={this.props.photos[this.state.currentIndex].url} />
          <div id="defaultIconCol" style={iconColCSS}>
            {iconComponents}
          </div>
          {this.state.iconIndex > 0 &&
            <svg style={topArrowCSS} width={ICON_COL_WIDTH * 0.4} height={ICON_COL_WIDTH * 0.4} onClick={this.shiftIconsLeft} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330"><path d="M324 209.3L174 96.8c-5.3-4-12.7-4-18 0L6 209.3c-6.6 5-8 14.4-3 21 2.9 3.9 7.5 6 12 6 3.1 0 6.3-1 9-3L165 127.5l141 105.8c6.6 5 16 3.6 21-3C332 223.6 330.6 214.2 324 209.3z"/></svg>
          }
          {this.state.iconIndex < (this.props.photos.length - 5) &&
            <svg style={downArrowCSS} transform="rotate(180)" width={ICON_COL_WIDTH * 0.4} height={ICON_COL_WIDTH * 0.4} onClick={this.shiftIconsRight} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330"><path d="M324 209.3L174 96.8c-5.3-4-12.7-4-18 0L6 209.3c-6.6 5-8 14.4-3 21 2.9 3.9 7.5 6 12 6 3.1 0 6.3-1 9-3L165 127.5l141 105.8c6.6 5 16 3.6 21-3C332 223.6 330.6 214.2 324 209.3z"/></svg>
          }
          <svg style={leftArrowCSS} width={LEFT_OFFSET * 0.4} height={LEFT_OFFSET * 0.4} onClick={this.cycleLeft} data-name="arrow_left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path fill="#ff0000" d="M51.66 2.65L49 0 2.66 46.34h-.01L0 48.99h.01L0 49l2.65 2.66.01-.01L49 97.99l2.66-2.65L5.31 48.99 51.66 2.65z"/></svg>
          <svg style={rightArrowCSS} width={LEFT_OFFSET * 0.4} height={LEFT_OFFSET * 0.4} onClick={this.cycleRight} data-name="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path fill="#ff0000" d="M0 95.34l2.65 2.65 46.34-46.34.01.01L51.66 49l-.01-.01h.01L49 46.34h-.01L2.65 0 0 2.65l46.34 46.34L0 95.34z"/></svg>
      </div>

    );
  }
}
export default DefaultGallery;