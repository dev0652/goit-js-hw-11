import Notiflix from 'notiflix';

const messages = {
  emptySearch: 'Type in something',
  emptyResult:
    'Sorry, there are no images matching your search query. Please try again',

  outOfResults: "We're sorry, but you've reached the end of search results.",
};

export function onEmptySearch() {
  Notiflix.Notify.info(messages.emptySearch);
}

export function onEmptyResult() {
  Notiflix.Notify.failure(messages.emptyResult);
}

export function onOutOfResults() {
  Notiflix.Notify.info(messages.outOfResults);
}

// Promise error handler
export function handleErrors(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    Notiflix.Notify.failure(error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    Notiflix.Notify.failure(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    Notiflix.Notify.failure('Error', error.message);
  }
  // Notiflix.Notify.failure(error.config);
}
