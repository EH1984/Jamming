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

  // render() {
  //   return <button onClick={this.search}>Click For HREF</button>;
  // }
}

export default Spotify;
