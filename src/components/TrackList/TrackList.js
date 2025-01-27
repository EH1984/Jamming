import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <div className='TrackList'>
        {this.props.tracks.map(data => (
          <Track
            key={data.id}
            track={data}
            onAdd={this.props.onAdd}
            onRemove={this.props.onRemove}
            isRemoval={this.props.isRemoval}
          />
        ))}
      </div>
    );
  }
}

export default TrackList;
