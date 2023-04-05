import Notiflix from 'notiflix';

const messages = {
  emptySearch: 'Please specify a query first',
  emptyResult:
    'Sorry, there are no images matching your search query. Please try again',
  outOfResults: "We're sorry, but you've reached the end of search results",
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

export function onSearchSuccess(totalHits) {
  Notiflix.Notify.success(`Success. Loaded ${totalHits} images`);
}

// Promise error handler
export function handleErrors(error) {
  Notiflix.Notify.failure('Error', error.message);
}
