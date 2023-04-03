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

const refs = getRefs();

// ###########################################################################

// Create a new PixabayApi instance
const pixabay = new PixabayApi();
pixabay.searchParameters = searchParameters;
axios.defaults.baseURL = 'https://pixabay.com/api/';

// ###########################################################################

// Listen to form submit
refs.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  intObserver.unobserve(refs.scrollGuard); // remove observer if present
  refs.gallery.innerHTML = ''; // clear results

  pixabay.q = event.currentTarget.elements.searchQuery.value.trim(); // store the query for infinite scroll

  if (!pixabay.q) {
    return onEmptySearch();
  }

  pixabay.resetPage(); // reset page count

  // refs.form.reset(); // clear form

  // pixabay.fetch().then(handleSuccess).catch(handleErrors);

  try {
    const response = await pixabay.fetch();
    return handleSuccess(response);
  } catch (error) {
    handleErrors(error);
  }
}

// ###########################################################################

// Handle successful resolve of the fetch promise
function handleSuccess({ hits, totalHits }) {
  if (totalHits === 0) {
    return onEmptyResult();
  }

  if (pixabay.page - 1 === 1) {
    onSearchSuccess(totalHits);
    pixabay.totalHits = totalHits; // store totalHits value for calculations
  }

  const markup = makeGalleryMarkup(hits);
  paintResults(markup); // render gallery markup

  intObserver.observe(refs.scrollGuard); // observe intersection with end of gallery for infinite scroll
}

// ###########################################################################

// Intersection observer

const intObserverOptions = {
  rootMargin: '0px',
  threshold: 1.0,
};

const intObserver = new IntersectionObserver(
  intObserverCallback,
  intObserverOptions
);

function intObserverCallback(entries) {
  entries.forEach(async entry => {
    //
    if (entry.isIntersecting) {
      //
      const shownHits = pixabay.searchParameters.per_page * (pixabay.page - 1);

      if (shownHits >= pixabay.totalHits) {
        return onOutOfResults();
      } else {
        try {
          const response = await pixabay.fetch();
          handleSuccess(response);

          const scrollMultiplier = Math.floor(
            window.innerHeight / pixabay.cardHeight
          );

          scrollBy(scrollMultiplier);
        } catch (error) {
          handleErrors(error);
        }
      }
    }
  });
}

// ###########################################################################

const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.8,
});

// Paint gallery
function paintResults(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  pixabay.cardHeight = Math.floor(
    refs.gallery.firstElementChild.getBoundingClientRect().height
  );

  console.log(window.innerHeight / pixabay.cardHeight);

  lightbox.refresh(); // destroy and reinitialize the lightbox
}

// ###########################################################################

function scrollBy(multiplier) {
  //
  const options = {
    top: pixabay.cardHeight * multiplier,
    behavior: 'smooth',
  };

  window.scrollBy(options);
}
