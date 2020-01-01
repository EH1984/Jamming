import React from 'react';
import TrackList from '../TrackList/TrackList';
import './ViewPlaylist.css';

class ViewPlaylist extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.getPlaylistName(e.target.value);
  }

  render() {
    return (
      <div className='ViewPlaylist'>
        <input
          defaultValue={'Enter a playlist'}
          onChange={this.handleChange}
        ></input>
        <TrackList tracks={this.props.storedPlaylist} />
        <button className='ViewPlaylist-get' onClick={this.props.getPlaylist}>
          GET PLAYLIST
        </button>
      </div>
    );
  }
}

export default ViewPlaylist;
