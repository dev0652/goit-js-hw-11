// Axios
import axios from 'axios';

// Create PixabayApi class
export default class PixabayApi {
  constructor() {
    this.page = 1;
    this.query = '';
    this.searchParameters = {};
    this.totalHits = null;
    // this.cardHeight = null;
  }

  renderSearchParams() {
    // return Object.entries(this.searchParameters)
    //   .map(element => `${element[0]}=${element[1]}`)
    //   .join('&');
    return new URLSearchParams(this.searchParameters);
    // return instance.toString();
  }

  async fetch() {
    const params = this.renderSearchParams(); // will be parsed automatically in the template string - https://youtu.be/B0vwmjOznEI?t=5174
    const URL = `?${params}&page=${this.page}&q=${this.query}`;

    return await axios.get(URL);
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get q() {
    return this.query;
  }

  set q(newQuery) {
    this.query = newQuery;
  }
}
