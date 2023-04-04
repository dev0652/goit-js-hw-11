export default function () {
  return {
    header: document.querySelector('header'),
    logo: document.querySelector('.pixabay-logo'),
    logoCnt: document.querySelector('.pixabay-logo-wrapper'),
    form: document.querySelector('#search-form'),
    box: document.querySelector('#search-box'),
    searchBtn: document.querySelector('#search-button'),
    gallery: document.querySelector('.gallery'),
    scrollGuard: document.querySelector('.scroll-guard'),
  };
}
