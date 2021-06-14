import React from 'react';
const ICON_HEIGHT = 0.06 * window.innerHeight;

/**
 *
 * props.image: image url
 * props.index: which index in the gallery.photos array does this component correspond to?
 * props.isSelected: is this one selected?
 * props.clickHandler: pass in props.index
 */

var ExpandedIconImage = function(props) {
  var iconCSS = {
    objectFit: 'contain',
    height: ICON_HEIGHT,
    width: ICON_HEIGHT * 1.2,
    backgroundColor: 'white',
    marginLeft: 0.085 * ICON_HEIGHT,
    marginRight: 0.085 * ICON_HEIGHT,
    border: props.isSelected ? 'solid orange 2px' : 'solid black 1px'
  };

  return (
    <div onClick={() => {props.clickHandler(props.index)}}>
      <img style={iconCSS} src={props.image}/>
    </div>
  );
};

export default ExpandedIconImage;