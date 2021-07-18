import React from 'react';

/**
 *
 * props.image: image url
 * props.index: which index in the gallery.photos array does this component correspond to?
 * props.isSelected: is this one selected?
 * props.clickHandler: pass in props.index
 */

var DefaultIconImage = function(props) {

  return (
      <img className={props.isSelected ? "selectedDefaultIconImage defaultIconImage" : "defaultIconImage"} src={props.image} onClick={() => {props.clickHandler(props.index)}}/>
  );
};

export default DefaultIconImage;