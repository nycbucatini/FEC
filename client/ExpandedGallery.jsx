import React from 'react';
import ExpandedIconImage from './ExpandedIconImage.jsx';
const OUTER_WIDTH = 1 * window.innerWidth;
const OUTER_HEIGHT = 1 * window.innerHeight;
const INNER_WIDTH  = 0.9 * window.innerWidth;
const INNER_HEIGHT = 0.87 * window.innerHeight;
const LEFT_OUTER_OFFSET = 0 * window.innerWidth;
const LEFT_INNER_OFFSET = 0.05 * window.innerWidth; //using css relative position
const TOP_OUTER_OFFSET = 0; //inner and outer share this edge
const FRAME_ASPECT = INNER_WIDTH / INNER_HEIGHT;

/**
 * Will receive this.props.photos, array of photos for selected style.,
 * this.props.switchGallery, handler function for switching the gallery
 * this.props.startingIndex: Photo to start on. used if you switched from another gallery
 * this.props.logInteraction(element) log clicks
 */

const outerCSS = {
  position: 'relative',
  top: TOP_OUTER_OFFSET,
  left: LEFT_OUTER_OFFSET,
  height: OUTER_HEIGHT,
  width: OUTER_WIDTH,
  backgroundColor: '#ffffff',
};

const innerCSS = {
  position: 'relative',
  left: LEFT_INNER_OFFSET,
  height: INNER_HEIGHT,
  width: INNER_WIDTH,
  backgroundColor: '#ffffff',
  overflow: 'hidden'
};

const iconRowCSS = {
  position: 'relative',
  left: LEFT_INNER_OFFSET,
  height: OUTER_HEIGHT - INNER_HEIGHT,
  width: INNER_WIDTH,
  backgroundColor: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
};

const leftArrowCSS = {
  position: 'absolute',
  top: TOP_OUTER_OFFSET + INNER_HEIGHT * 0.5 - LEFT_OUTER_OFFSET * 0.3,
  left: LEFT_INNER_OFFSET * 0.2,
  zIndex: 3
};

const rightArrowCSS = {
  position: 'absolute',
  top: TOP_OUTER_OFFSET + INNER_HEIGHT * 0.5 - LEFT_OUTER_OFFSET * 0.3,
  left: LEFT_INNER_OFFSET * 1.1 + INNER_WIDTH,
  zIndex: 3
};

const closeCSS = {
  position: 'absolute',
  top: 0,
  left: window.innerWidth - LEFT_INNER_OFFSET * 0.7,
  zIndex: 3
};

class ExpandedGallery extends React.Component {
  constructor(props) {
    super(props);

    this.checkAspectRatio = this.checkAspectRatio.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onClick = this._onClick.bind(this);
    this.iconClicked = this.iconClicked.bind(this);
    this.cycleLeft = this.cycleLeft.bind(this);
    this.cycleRight = this.cycleRight.bind(this);
    this.shiftIconsLeft = this.shiftIconsLeft.bind(this);
    this.shiftIconsRight = this.shiftIconsRight.bind(this);
    this.getIconArray = this.getIconArray.bind(this);
    this.getPhotoIndexFromIconPosition = this.getPhotoIndexFromIconPosition.bind(this);
    this.getImageCSS = this.getImageCSS.bind(this);

    //this.props.photos
    //this.props.switchGallery
    //this.props.startingIndex
    this.state = {
      zoomedIn: false,
      mouseX: LEFT_INNER_OFFSET + LEFT_OUTER_OFFSET,
      mouseY: TOP_OUTER_OFFSET,
      imageAspect: 1,
      currentIndex: this.props.startingIndex,
      iconIndex: this.props.startingIndex
    };
  }

  componentDidMount() {
    this.checkAspectRatio();
  }

  checkAspectRatio() {
    var image = document.querySelector('#expandedImage');
    image.onload = () => {
      var aspect = image.naturalWidth / image.naturalHeight;
      this.setState({
        imageAspect: aspect
      });
    };
  }

  _onMouseMove(e) {
    this.setState({
      mouseX: e.pageX,
      mouseY: e.pageY
    });
  }

  _onClick(e) {
    this.props.logInteraction('expandedGalleryZoom');
    this.setState({
      zoomedIn: !this.state.zoomedIn
    });
  }

  iconClicked(index) {
    this.props.logInteraction('ExpandedIcon');
    this.setState({
      currentIndex: index,
      zoomedIn: false
    }, this.checkAspectRatio);
  }

  cycleLeft() {
    this.props.logInteraction('expandedGalleryArrow');
    var newIndex = this.state.currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this.props.photos.length - 1;
    }
    this.setState({
      currentIndex: newIndex,
      zoomedIn: false,
      iconIndex: newIndex
    }, this.checkAspectRatio);
  }

  cycleRight() {
    this.props.logInteraction('expandedGalleryArrow');
    var newIndex = (this.state.currentIndex + 1) % this.props.photos.length;
    this.setState({
      currentIndex: newIndex,
      zoomedIn: false,
      iconIndex: newIndex
    }, this.checkAspectRatio);
  }

  shiftIconsLeft() {
    this.props.logInteraction('expandedIconArrow');
    var newIndex = this.state.iconIndex - 2;
    if (newIndex < 0) {
      newIndex += this.props.photos.length;
    }
    this.setState({
      iconIndex: newIndex
    });
  }

  shiftIconsRight() {
    this.props.logInteraction('expandedIconArrow');
    var newIndex = this.state.iconIndex + 2;
    newIndex %= this.props.photos.length;
    this.setState({
      iconIndex: newIndex
    });
  }

  getIconArray() {
    var length = this.props.photos.length <= 7 ? this.props.photos.length : 7;
    return this.props.photos.slice(this.state.iconIndex).concat(this.props.photos).slice(0,length);
  }

  getPhotoIndexFromIconPosition(position) {
    return (this.state.iconIndex + position) % this.props.photos.length;
  }

  getImageCSS(pageX, pageY) {
    if (!this.state.zoomedIn) {
      return {
        objectFit: 'contain',
        width: INNER_WIDTH,
        height: INNER_HEIGHT,
        cursor: 'cell'
      };
    }

    //Math is off somehow but results are acceptable.
    //Will come back to this and try to figure out the right equation using an inductive approach

    var aspectMultiplier = (this.state.imageAspect / FRAME_ASPECT) ** 2;
    var percentageX = (pageX - LEFT_INNER_OFFSET - LEFT_OUTER_OFFSET) / INNER_WIDTH;
    var percentageY = (pageY - TOP_OUTER_OFFSET) / INNER_HEIGHT;
    var xMultiplier = 0.6 * -2.5 * INNER_WIDTH * aspectMultiplier;
    var yMultiplier = 0.6 * -2.5 * INNER_HEIGHT;
    var posX = this.state.imageAspect <= 0.8 ? 0 : Math.floor(percentageX * xMultiplier);
    var posY = Math.floor(percentageY * yMultiplier);
    return {
      objectFit: 'contain',
      width: 2.5 * INNER_WIDTH,
      height: 2.5 * INNER_HEIGHT,
      objectPosition: `${posX}px ${posY}px`,
      cursor: 'ew-resize'
    };
  }

  render() {
    var imageCSS = this.getImageCSS(this.state.mouseX, this.state.mouseY);
    var icons = this.getIconArray();
    var iconComponents = [];
    if (this.props.photos.length > 7) { //leftIconArrow
      iconComponents.push(<svg className="expandedIconArrow" width={LEFT_INNER_OFFSET * 0.4} height={LEFT_INNER_OFFSET * 0.4} onClick={this.shiftIconsLeft} data-name="arrow_left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M51.66 2.65L49 0 2.66 46.34h-.01L0 48.99h.01L0 49l2.65 2.66.01-.01L49 97.99l2.66-2.65L5.31 48.99 51.66 2.65z"/></svg>);
    }
    for (var i = 0; i< icons.length; i++) {
      var index = this.getPhotoIndexFromIconPosition(i);
      iconComponents.push(<ExpandedIconImage image={icons[i].thumbnail_url} index={index} isSelected={index === this.state.currentIndex} clickHandler={this.iconClicked}/>);
    }
    if (this.props.photos.length > 7) { //rightIconArrow
      iconComponents.push(<svg className="expandedIconArrow" width={LEFT_INNER_OFFSET * 0.4} height={LEFT_INNER_OFFSET * 0.4} onClick={this.shiftIconsRight} data-name="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M0 95.34l2.65 2.65 46.34-46.34.01.01L51.66 49l-.01-.01h.01L49 46.34h-.01L2.65 0 0 2.65l46.34 46.34L0 95.34z"/></svg>);
    }

    return (
      <div style={outerCSS}>
        <div id="imagePanel"style={innerCSS} onMouseMove={this._onMouseMove} onClick={this._onClick}>
          <img id="expandedImage" style={imageCSS} src={this.props.photos[this.state.currentIndex].url === null ? 'https://www.lynbrooklibrary.org/wp-content/uploads/2020/06/coming-soon-neon-sign.jpg' : this.props.photos[this.state.currentIndex].url} />
        </div>
        {!this.state.zoomedIn &&
          <React.Fragment>
            <svg className="expandedGalleryArrow" style={leftArrowCSS} width={LEFT_INNER_OFFSET * 0.7} height={LEFT_INNER_OFFSET * 0.7} onClick={this.cycleLeft} data-name="arrow_left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M51.66 2.65L49 0 2.66 46.34h-.01L0 48.99h.01L0 49l2.65 2.66.01-.01L49 97.99l2.66-2.65L5.31 48.99 51.66 2.65z"/></svg>
            <svg className="expandedGalleryArrow" style={rightArrowCSS} width={LEFT_INNER_OFFSET * 0.7} height={LEFT_INNER_OFFSET * 0.7} onClick={this.cycleRight} data-name="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M0 95.34l2.65 2.65 46.34-46.34.01.01L51.66 49l-.01-.01h.01L49 46.34h-.01L2.65 0 0 2.65l46.34 46.34L0 95.34z"/></svg>
            <div id="expandedIconRow" style={iconRowCSS}>
              {iconComponents}
            </div>
            <svg id="expandedGalleryClose" style={closeCSS} width={LEFT_INNER_OFFSET * 0.5} height={LEFT_INNER_OFFSET * 0.5} onClick={() => {this.props.switchGallery(this.state.currentIndex)}} data-name="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M72 11.77L60.23 0 36 24.23 11.77 0 0 11.77 24.23 36 0 60.23 11.77 72 36 47.77 60.23 72 72 60.23 47.77 36 72 11.77z"/></svg>
          </React.Fragment>
        }

      </div>

    );
  }
}
export default ExpandedGallery;