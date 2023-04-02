// import SimpleLightbox from 'simplelightbox';
import SimpleLightbox from 'simple-lightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getRefs } from './js/refs';
const refs = getRefs();

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// // Listen to clicks on image previews
refs.gallery.addEventListener('click', onImgPreviewClick);

function onImgPreviewClick(event) {
  event.preventDefault();

  const target = event.target;

  // Check if the clicked area is an image
  const isImagePreview = target.classList.contains('image');

  if (!isImagePreview) {
    return;
  }

  // Create a basicLightbox image instance
  const instance = basicLightbox.create(`<img src="${target.dataset.source}">`);

  function onLightBoxOpen() {
    window.addEventListener('keydown', onEscKey);
  }

  function onEscKey(event) {
    if (event.code === 'Escape') {
      instance.close(removeListener);
    }
  }

  //Remove listener
  function removeListener() {
    window.removeEventListener('keydown', onEscKey);
  }

  // Show a full-sized image + listen to Esc key press
  return instance.show(onLightBoxOpen);
}
