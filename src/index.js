import { getRefs } from './js/refs';
import { PixabayApi } from './js/api';
import { makeGalleryMarkup } from './js/markup';
import {
  handleErrors,
  onEmptyResult,
  onOutOfResults,
  onEmptySearch,
} from './js/notifications.js';
import { searchParameters, AUTH_TOKEN } from './js/parameters.js';

import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

// Refs
const refs = getRefs();

// Create a new PixabayApi instance
const pixabay = new PixabayApi();

pixabay.searchParameters = searchParameters;

// Listen to form submit
refs.form.addEventListener('submit', onSubmit);

function onSubmit(event) {
  event.preventDefault();

  pixabay.q = event.currentTarget.elements.searchQuery.value.trim();

  pixabay.resetPage();

  if (!pixabay.q) {
    onEmptySearch();
    return;
  }

  pixabay.fetch().then(handleSuccess).catch(handleErrors);
}

function handleSuccess(data) {
  if (data.totalHits === 0) {
    onEmptyResult();
    return;
  }

  if (pixabay.searchParameters.per_page * pixabay.page > data.totalHits) {
    onOutOfResults();
    return;
  }

  const markup = makeGalleryMarkup(data.hits);

  refs.gallery.insertAdjacentHTML('beforeend', markup);

  observer.observe(document.querySelector('.scroll-guard'));
}

const options = {
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(callback, options);

function callback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // code
      pixabay.fetch().then(handleSuccess).catch(handleErrors);
    }
  });
}
