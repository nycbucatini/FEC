import React from 'react';
const ICON_HEIGHT = 0.075 * window.innerHeight;

/**
 *
 * props.image: image url
 * props.index: which index in the gallery.photos array does this component correspond to?
 * props.isSelected: is this one selected?
 * props.clickHandler: pass in props.index
 */

var DefaultIconImage = function(props) {
  var iconCSS = {
    objectFit: 'cover',
    height: ICON_HEIGHT,
    width: ICON_HEIGHT,
    backgroundColor: 'white',
    marginTop: 0.125 * ICON_HEIGHT,
    marginBottom: 0.125 * ICON_HEIGHT,
    border: props.isSelected ? 'solid orange 2px' : 'solid black 1px'
  };

  return (
    <div onClick={() => {props.clickHandler(props.index)}}>
      <img style={iconCSS} src={props.image}/>
    </div>
  );
};

export default DefaultIconImage;