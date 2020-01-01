import React from 'react';

let accessToken = '';
let expiresIn = '';
const clientId = 'bd433194c7cd482f89aa039b0ff09daf';
const redirectUrl = 'http://localhost:3000/';

class Spotify extends React.Component {
  constructor(props) {
    super(props);

    this.getAccessToken = this.getAccessToken.bind(this);
    this.search = this.search.bind(this);
  }
  static getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      // Get the access token and expiry out of the url if it exists
      let temp_access_token = window.location.href.match(
        /access_token=([^&]*)/
      );
      let temp_expires_in = window.location.href.match(/expires_in=([^&]*)/);

      // If they dont exist get the user to grant access
      if (!temp_access_token && !temp_expires_in) {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
      } else {
        // Set the token and expiry variables from the array
        accessToken = temp_access_token[1];
        expiresIn = temp_expires_in[1];

        // Set the token to expire and remove them from the url
        window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      }
    }
  }

  static async search(term) {
    try {
      console.log(accessToken);
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      const jsonResponse = await response.json();

      if (!jsonResponse.tracks) {
        return [];
      } else {
        return jsonResponse.tracks.items.map(item => {
          return {
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            uri: item.uri
          };
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  //continue 25/12/2019
  static async savePlaylist(name, tracks) {
    if (!name || !tracks) {
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = '';
    console.log(accessToken);

    try {
      // Get the users spotify ID
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers
      }).then(response => response.json());
      userId = response.id;

      // Set the payload to send to spotify api to create a playlist
      const payload = {
        method: 'POST',
        headers,
        body: JSON.stringify({ name })
      };

      // Make the request to create a playlist and save the playlist id
      const playlist = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        payload
      ).then(response => response.json());

      const playlistId = playlist.id;

      // Payload to add songs to playlist
      const playload = {
        method: 'POST',
        headers,
        body: JSON.stringify({ uris: tracks })
      };
      // Add songs to the playlist
      const savedPlaylist = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        playload
      ).then(response => response.json());
      console.log(savedPlaylist);
      console.log('Playlist saved');
    } catch (err) {
      console.log(err.message);
    }
  }

  static async getPlaylists() {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = '';

    try {
      // Get the users spotify ID
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers
      }).then(response => response.json());
      userId = response.id;

      // Retrieve the users playlists
      const playlists = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        { headers }
      ).then(response => response.json());

      return playlists;
    } catch (err) {
      console.log(err.message);
    }
  }

  static async getPlaylist(id) {
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    try {
      const playlist = await fetch(
        `https://api.spotify.com/v1/playlists/${id}`,
        { headers }
      ).then(response => response.json());

      return playlist.tracks.items.map(item => {
        return {
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          album: item.track.album.name,
          uri: item.track.uri
        };
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  // render() {
  //   return <button onClick={this.search}>Click For HREF</button>;
  // }
}

export default Spotify;
