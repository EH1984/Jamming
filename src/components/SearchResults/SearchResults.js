import React, { Component } from 'react';
import TrackList from '../TrackList/TrackList';
import './SearchResults.css';

class SearchResults extends Component {
  render() {
    // console.log(this.props.onAdd);
    return (
      <div className='SearchResults'>
        <h2>Results</h2>
        <TrackList
          tracks={this.props.searchResults}
          onAdd={this.props.onAdd}
          isRemoval={false}
        />
      </div>
    );
  }
}

export default SearchResults;
