import React from 'react';
import Track from '../Track/Track';
import './TrackList.css';

class TrackList extends React.Component {
  render() {
    console.log(this.props.searchResults);
    return (
      <div className='TrackList'>
        {this.props.searchResults.map(data => (
          <Track />
        ))}
      </div>
    );
  }
}

export default TrackList;
