import React from 'react';
const RIGHT_PANEL_WIDTH = 0.3 * window.innerWidth;

//this.props.icon - url string for image
//this.props.index - index of productDetail.styles corresponding to this component
//this.props.isSelected - true/false
//this.props.changeStyle(index) - call on click to change style
class StyleIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var iconCSS = {
      objectFit: 'cover',
      marginLeft: 0,
      marginRight: RIGHT_PANEL_WIDTH / 25,
      marginBottom: RIGHT_PANEL_WIDTH /60,
      width: RIGHT_PANEL_WIDTH / 7,
      height: RIGHT_PANEL_WIDTH / 7,
      borderRadius: '50%',
      border: this.props.isSelected ? '3px orange solid' : '2px solid'
    };

    var checkMarkCSS = {
      position: 'absolute',
      left: 0.9 * RIGHT_PANEL_WIDTH / 7,
      zLayer: 3
    };

    return (
      <div style={{position: 'relative'}}>
        <img class="styleIcon" style={iconCSS} src={this.props.icon} onClick={() => {this.props.changeStyle(this.props.index);}}/>
        {this.props.isSelected &&
          <svg style={checkMarkCSS} width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path fill="blue" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm7 7.457l-9.005 9.565-4.995-5.865.761-.649 4.271 5.016 8.24-8.752.728.685z"/></svg>
        }
      </div>
    );
  }
}
export default StyleIcon;