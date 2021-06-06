import React from 'react';
const OUTER_WIDTH = 0.8 * window.innerWidth;
const OUTER_HEIGHT = 0.75 * window.innerHeight;
const INNER_WIDTH  = 0.7 * window.innerWidth;
const INNER_HEIGHT = 0.65 * window.innerHeight;
const LEFT_OUTER_OFFSET = 0.1 * window.innerWidth;
const LEFT_INNER_OFFSET = 0.05 * window.innerWidth; //using css relative position
const TOP_OUTER_OFFSET = 50; //inner and outer share this edge
/**
 * FULL BOUNDS -> 1/10 to 9/10 of the window.innerWidth
 * IMAGE BOUNDS -> 2/10 to 8/10 of Screen
 * INNER constants are just the photo, OUTER for entire gallery widget
 */

const outerCSS = {
  position: 'relative',
  top: TOP_OUTER_OFFSET,
  left: LEFT_OUTER_OFFSET,
  height: OUTER_HEIGHT,
  width: OUTER_WIDTH,
  backgroundColor: 'gray'
};

const innerCSS = {
  position: 'relative',
  left: LEFT_INNER_OFFSET,
  height: INNER_HEIGHT,
  width: INNER_WIDTH,
  backgroundColor: 'white',
  overflow: 'hidden'
};

class ExpandedGallery extends React.Component {
  constructor(props) {
    super(props);

    this._onMouseMove = this._onMouseMove.bind(this);
    this.getImageCSS = this.getImageCSS.bind(this);

    this.state = {
      mouseX: LEFT_INNER_OFFSET + LEFT_OUTER_OFFSET,
      mouseY: TOP_OUTER_OFFSET
    };
  }

  _onMouseMove(e) {
    // console.log(e.pageX, e.pageY);
    this.setState({
      mouseX: e.pageX,
      mouseY: e.pageY
    });
  }

  getImageCSS(pageX, pageY) {
    //objectposition X should be between 0 and -2.5 * INNER_WIDTH *0.6
    var percentageX = (pageX - LEFT_INNER_OFFSET - LEFT_OUTER_OFFSET) / INNER_WIDTH;
    var percentageY = (pageY - TOP_OUTER_OFFSET) / INNER_HEIGHT;
    var xMultiplier = 0.6 * -2.5 * INNER_WIDTH;
    var yMultiplier = 0.6 * -2.5 * INNER_HEIGHT;
    var posX = Math.floor(percentageX * xMultiplier);
    var posY = Math.floor(percentageY * yMultiplier);
    return {
      objectFit: 'contain',
      width: 2.5 * INNER_WIDTH,
      height: 2.5 * INNER_HEIGHT,
      objectPosition: `${posX}px ${posY}px`
    };
  }

  render() {
    var imageCSS = this.getImageCSS(this.state.mouseX, this.state.mouseY);

    return (
      <div style={outerCSS}>
        <div style={innerCSS} onMouseMove={this._onMouseMove}>
          {/* {this.props.photos.map(photo =>
            <div>{JSON.stringify(photo)}</div>
          )} */}
          <img style={imageCSS} src="https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80" />
        </div>

      </div>

    );
  }
}
export default ExpandedGallery;