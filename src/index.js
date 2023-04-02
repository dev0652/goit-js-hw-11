// Imports
import getRefs from './js/refs';
import PixabayApi from './js/api';
import makeGalleryMarkup from './js/markup';
import searchParameters from './js/parameters.js';

import {
  handleErrors,
  onEmptyResult,
  onOutOfResults,
  onEmptySearch,
  onSearchSuccess,
} from './js/notifications.js';

import axios from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// ###########################################################################

// Refs
const refs = getRefs();

// ###########################################################################

// Create a new PixabayApi instance
const pixabay = new PixabayApi();
pixabay.searchParameters = searchParameters;
axios.defaults.baseURL = 'https://pixabay.com/api/';

// ###########################################################################

// Listen to form submit
refs.form.addEventListener('submit', onSubmit);

// onSubmit
function onSubmit(event) {
  event.preventDefault();

  if (refs.scrollGuard.classList.contains('shown')) {
    refs.scrollGuard.classList.remove('shown'); // The scroll guard element is hidden to prevent unwanted triggering of intersection callback until the gallery has loaded
    refs.gallery.innerHTML = ''; // clear previous gallery
  }

  pixabay.q = event.currentTarget.elements.searchQuery.value.trim(); // store the query for infinite scroll

  refs.form.reset();

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
    //
    if (entry.isIntersecting) {
      //
      const shownHits = pixabay.searchParameters.per_page * (pixabay.page - 1);

      if (shownHits > pixabay.totalHits) {
        return onOutOfResults();
      } else {
        pixabay.fetch().then(handleSuccess).catch(handleErrors);
        // scrollDown();
      }
    }
  });
}

// ###########################################################################
var gallery = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.8,
});

// Paint gallery
function paintResults(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.scrollGuard.classList.add('shown');

  if (pixabay.page - 1 > 1) {
    // Destroy and reinitialize the lightbox
    gallery.refresh();
  }
}

// ###########################################################################

// Smooth scroll - [при безкінечному скролі він не потрібен]

// function scrollDown() {
//   const { height: cardHeight } =
//     refs.gallery.firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 3,
//     behavior: 'smooth',
//   });
// }
