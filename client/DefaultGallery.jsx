import React from 'react';
class DefaultGallery extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.photos.map(photo =>
          <div>{JSON.stringify(photo)}</div>
        )}
      </div>

    );
  }
}
export default DefaultGallery;