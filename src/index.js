// Imports
import getRefs from './js/refs';
const refs = getRefs();

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
import { scrollToTop, toTopObserver } from './js/scroll-to-top';

import axios from 'axios';
import SimpleLightbox from 'simplelightbox';

// ##################################################################

// Create a new PixabayApi instance
const pixabay = new PixabayApi();
pixabay.searchParameters = searchParameters;
axios.defaults.baseURL = 'https://pixabay.com/api/';

// ##################################################################

// Listen to form submit
refs.form.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();

  checkSearchPosition(); // moves searchbar to the header

  intObserver.unobserve(refs.scrollGuard); // remove observer if present
  refs.gallery.innerHTML = ''; // clear results

  pixabay.q = event.currentTarget.elements.searchQuery.value.trim(); // store the query for infinite scroll

  if (!pixabay.q) {
    return onEmptySearch();
  }

  pixabay.resetPage(); // reset page count

  try {
    const response = await pixabay.fetch();
    return handleSuccess(response);
  } catch (error) {
    handleErrors(error);
  }
}

// ##################################################################

// Handle successful resolve of the fetch promise
function handleSuccess({ data: { hits, totalHits } }) {
  if (totalHits === 0) {
    return onEmptyResult();
  }

  if (pixabay.page === 1) {
    onSearchSuccess(totalHits);
    pixabay.totalHits = totalHits; // store totalHits value for calculations
  }

  pixabay.incrementPage(); // page count +1

  const markup = makeGalleryMarkup(hits);

  paintResults(markup); // render gallery markup

  intObserver.observe(refs.scrollGuard); // observe intersection with end of gallery for infinite scroll
}

// ##################################################################

const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.5,
});

// Paint gallery
function paintResults(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh(); // destroy and reinitialize the lightbox
}

// ##################################################################

// Infinite scroll

const intObserverOptions = {
  rootMargin: '500px',
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
      const shownHits = pixabay.searchParameters.per_page * (pixabay.page - 1);

      if (shownHits >= pixabay.totalHits) {
        return onOutOfResults();
      } else {
        try {
          handleSuccess(await pixabay.fetch());
        } catch (error) {
          handleErrors(error);
        }
      }
    }
  });
}

// ##################################################################

// Move search bar to the header if searching for the first time

function checkSearchPosition() {
  if (refs.form.classList.contains('above')) {
    return;
  }

  refs.logoCnt.classList.add('hidden');
  refs.form.classList.add('above');
  refs.header.classList.remove('hidden');

  const { height: pageHeaderHeight } = refs.header.getBoundingClientRect();
  document.body.style.paddingTop = `${pageHeaderHeight}px`;

  refs.target.classList.remove('hidden');
  toTopObserver.observe(refs.target);
  refs.scrollToTopButton.addEventListener('click', scrollToTop);
}

// ##################################################################
