// Imports
import { getRefs } from './js/refs';
import { PixabayApi } from './js/api';
import { makeGalleryMarkup } from './js/markup';
import {
  handleErrors,
  onEmptyResult,
  onOutOfResults,
  onEmptySearch,
  onSearchSuccess,
} from './js/notifications.js';
import { searchParameters, AUTH_TOKEN } from './js/parameters.js';

import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

// ###########################################################################

// Refs
const refs = getRefs();

// ###########################################################################

// Create a new PixabayApi instance
const pixabay = new PixabayApi();
pixabay.searchParameters = searchParameters;

// ###########################################################################

// Listen to form submit
refs.form.addEventListener('submit', onSubmit);

// onSubmit
function onSubmit(event) {
  event.preventDefault(); // do not reload the page
  refs.scrollGuard.classList.remove('shown');

  clearResults(); // clear gallery

  pixabay.q = event.currentTarget.elements.searchQuery.value.trim();
  event.currentTarget.elements.searchQuery.value = ''; // clear the search box

  if (!pixabay.q) {
    return onEmptySearch(); // if search field is empty
  }

  pixabay.resetPage(); // reset page count
  pixabay.fetch().then(handleSuccess).catch(handleErrors);
}

// ###########################################################################

// Handle successful resolve of the fetch promise
function handleSuccess(data) {
  if (data.totalHits === 0) {
    return onEmptyResult();
  }

  console.log('pixabay.page: ', pixabay.page);

  if (pixabay.page - 1 === 1) {
    onSearchSuccess(data.totalHits);
  }

  // Store totalHits value for calculations
  pixabay.totalHits = data.totalHits;

  // Create and render gallery markup
  const markup = makeGalleryMarkup(data.hits);
  paintResults(markup);

  // Wait a bit for the gallery to render
  setTimeout(() => {
    observer.observe(document.querySelector('.scroll-guard'));
  }, 500);
}

// ###########################################################################

// Intersection observer
const options = {
  rootMargin: '300px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(callback, options);

function callback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      //
      const shownHits = pixabay.searchParameters.per_page * (pixabay.page - 1);

      if (shownHits > pixabay.totalHits) {
        onOutOfResults();
        return;
      } else {
        pixabay.fetch().then(handleSuccess).catch(handleErrors);

        // Destroy and reinitialize the lightbox
        gallery.refresh();
      }
    }
  });
}

// ###########################################################################

// SimpleLightbox

// // import { SimpleLightbox } from './js/simplelightbox';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// new SimpleLightbox('.gallery a');

// // Listen to clicks on image previews
// refs.gallery.addEventListener('click', onImgPreviewClick);

// function onImgPreviewClick(event) {
//   event.preventDefault();

//   const target = event.target;
//   // gallery.open();
// }

// Clear gallery
function clearResults() {
  refs.gallery.innerHTML = '';
}

// Paint gallery
function paintResults(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.scrollGuard.classList.add('shown');
}
