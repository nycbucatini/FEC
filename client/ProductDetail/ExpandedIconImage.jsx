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
  return (
    <div onClick={() => {props.clickHandler(props.index)}}>
      <img className={props.isSelected ? 'expandedIconImage expandedIconImageSelected' : 'expandedIconImage'} src={props.image}/>
    </div>
  );
};

export default ExpandedIconImage;