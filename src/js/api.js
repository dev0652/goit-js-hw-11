// Axios
import axios from 'axios';

// Create PixabayApi class
export class PixabayApi {
  constructor() {
    this.page = 1;
    this.query = '';
    this.searchParameters = {};
  }

  makeOptions() {
    return Object.entries(this.searchParameters)
      .map(element => `${element[0]}=${element[1]}`)
      .join('&');
  }

  fetch() {
    const params = this.makeOptions();
    const URL = `?${params}&page=${this.page}&q=${this.query}`;

    return axios.get(URL).then(response => {
      this.incrementPage();
      return response.data;
    });
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
