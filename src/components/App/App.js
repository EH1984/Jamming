import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';
import ViewPlaylist from '../ViewPlaylist/ViewPlaylist';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: '',
      getPlaylistName: '',
      playlistTracks: [],
      storedPlaylistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.updateGetPlaylistName = this.updateGetPlaylistName.bind(this);
    this.getPlaylist = this.getPlaylist.bind(this);
  }

  componentDidMount() {
    Spotify.getAccessToken();
  }

  addTrack(track) {
    if (
      this.state.playlistTracks.some(plistTrack => track.id === plistTrack.id)
    ) {
      console.log('Already in playlist');
    } else {
      this.setState({ playlistTracks: [...this.state.playlistTracks, track] });
    }
  }

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(
        plistTrack => track.id !== plistTrack.id
      )
    });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  updateGetPlaylistName(name) {
    this.setState({ getPlaylistName: name });
  }

  savePlaylist() {
    console.log(this.state.playlistName);
    Spotify.savePlaylist(
      this.state.playlistName,
      this.state.playlistTracks.map(track => track.uri)
    );
    this.setState({ playlistName: '', playlistTracks: [] });
  }

  async search(term) {
    try {
      const results = await Spotify.search(term);
      console.log(results);
      this.setState({ searchResults: results });
    } catch (err) {
      console.log(err.message);
    }
  }

  async getPlaylist() {
    // Get a list of playlists
    const playlists = await Spotify.getPlaylists();

    // Get the playlist that the user typed in
    const playlist = playlists.items.filter(
      list => list.name === this.state.getPlaylistName
    );

    // Check if playlist exists
    if (playlist.length > 0) {
      // Get the playlist id
      const playlistId = playlist[0].id;
      // Get element from playlist to populate the component
      const newPlaylist = await Spotify.getPlaylist(playlistId);
      // Set the state for the stored playlist
      this.setState({ storedPlaylistTracks: newPlaylist });
    } else {
      console.log('Doesnt exist');
    }
  }

  render() {
    // console.log(this.state.playlistTracks);
    return (
      <div>
        <h1>
          Ja<span className='highlight'>mmm</span>ing
        </h1>
        <div className='App'>
          <SearchBar onSearch={this.search} />
          <div className='App-playlist'>
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <PlayList
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
            <ViewPlaylist
              storedPlaylist={this.state.storedPlaylistTracks}
              getPlaylist={this.getPlaylist}
              getPlaylistName={this.updateGetPlaylistName}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
