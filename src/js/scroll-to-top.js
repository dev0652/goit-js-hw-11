import getRefs from './refs';
const refs = getRefs();

const showOnPx = 500;

export function onScroll() {
  if (scrollContainer().scrollTop > showOnPx) {
    refs.toTopBtn.classList.remove('hidden');
    refs.toTopBtn.addEventListener('click', scrollToTop);
  } else {
    refs.toTopBtn.classList.add('hidden');
  }
}

export function scrollToTop() {
  //   scrollContainer().scrollTop = 0;

  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
}

function scrollContainer() {
  return document.documentElement || document.body;
}
