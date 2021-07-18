import React from 'react';
import ExpandedIconImage from './ExpandedIconImage.jsx';


/**
 * Will receive this.props.photos, array of photos for selected style.,
 * this.props.switchGallery, handler function for switching the gallery
 * this.props.startingIndex: Photo to start on. used if you switched from another gallery
 * this.props.logInteraction(element) log clicks
 */

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
      mouseX: 0.05 * window.innerWidth,
      mouseY: 0,
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
        position: 'relative',
        objectFit: 'contain',
        width: '100%',
        height: '100%',
        margin: 0,
        cursor: 'cell'
      };
    }

    //Math is off somehow but results are acceptable.
    //Will come back to this and try to figure out the right equation using an inductive approach
    var INNER_WIDTH  = 0.9 * window.innerWidth;
    var INNER_HEIGHT = 0.87 * window.innerHeight;
    var FRAME_ASPECT = INNER_WIDTH / INNER_HEIGHT;
    var LEFT_INNER_OFFSET = 0.05 * window.innerWidth; //using css relative position



    var aspectMultiplier = (this.state.imageAspect / FRAME_ASPECT) ** 2;
    var percentageX = (pageX - LEFT_INNER_OFFSET) / INNER_WIDTH;
    var percentageY = (pageY) / INNER_HEIGHT;
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
      iconComponents.push(<svg id="expandedIconLeftArrow" width={30} height={30} onClick={this.shiftIconsLeft} data-name="arrow_left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M51.66 2.65L49 0 2.66 46.34h-.01L0 48.99h.01L0 49l2.65 2.66.01-.01L49 97.99l2.66-2.65L5.31 48.99 51.66 2.65z"/></svg>);
    }
    for (var i = 0; i< icons.length; i++) {
      var index = this.getPhotoIndexFromIconPosition(i);
      iconComponents.push(<ExpandedIconImage image={icons[i].thumbnail_url} index={index} isSelected={index === this.state.currentIndex} clickHandler={this.iconClicked}/>);
    }
    if (this.props.photos.length > 7) { //rightIconArrow
      iconComponents.push(<svg id="expandedIconRightArrow" width={30} height={30} onClick={this.shiftIconsRight} data-name="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M0 95.34l2.65 2.65 46.34-46.34.01.01L51.66 49l-.01-.01h.01L49 46.34h-.01L2.65 0 0 2.65l46.34 46.34L0 95.34z"/></svg>);
    }

    return (
      <div id="expandedGallery">
        <div id="imagePanel" onMouseMove={this._onMouseMove} onClick={this._onClick}>
          <img id="expandedImage" style={imageCSS} src={this.props.photos[this.state.currentIndex].url === null ? 'https://www.lynbrooklibrary.org/wp-content/uploads/2020/06/coming-soon-neon-sign.jpg' : this.props.photos[this.state.currentIndex].url} />
        </div>
        {!this.state.zoomedIn &&
          <React.Fragment>
            <svg id="expandedGalleryLeftArrow" width={'8%'} height={'8%'} onClick={this.cycleLeft} data-name="arrow_left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M51.66 2.65L49 0 2.66 46.34h-.01L0 48.99h.01L0 49l2.65 2.66.01-.01L49 97.99l2.66-2.65L5.31 48.99 51.66 2.65z"/></svg>
            <svg id="expandedGalleryRightArrow" width={'8%'} height={'8%'} onClick={this.cycleRight} data-name="arrow-right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.65 97.99"><path d="M0 95.34l2.65 2.65 46.34-46.34.01.01L51.66 49l-.01-.01h.01L49 46.34h-.01L2.65 0 0 2.65l46.34 46.34L0 95.34z"/></svg>
            <div id="expandedIconRow">
              {iconComponents}
            </div>
            <svg id="expandedGalleryClose" width={'5%'} height={'5%'} onClick={() => {this.props.switchGallery(this.state.currentIndex)}} data-name="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><path d="M72 11.77L60.23 0 36 24.23 11.77 0 0 11.77 24.23 36 0 60.23 11.77 72 36 47.77 60.23 72 72 60.23 47.77 36 72 11.77z"/></svg>
          </React.Fragment>
        }

      </div>

    );
  }
}
export default ExpandedGallery;