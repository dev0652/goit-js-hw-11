const lightStyles = document.querySelector(
  'link[rel=stylesheet] [media*=prefers-color-scheme][media*=light]'
);
const darkStyles = document.querySelector(
  'link[rel=stylesheet] [media*=prefers-color-scheme][media*=dark]'
);
const darkSchemeMedia = matchMedia('(prefers-color-scheme: dark)');
const switcher = document.querySelector('.color-scheme-switcher');

// localStorage.setItem('color-scheme', 'light');

function setupSwitcher() {
  const savedScheme = getSavedScheme();

  if (savedScheme !== null) {
  }
}
function setScheme(scheme) {
  switchMedia(scheme);

  if (scheme === 'auto') {
    clearScheme();
  } else {
    saveScheme(scheme);
  }
}

function switchMedia(scheme) {
  let lightMedia;
  let darkMedia;

  if (scheme === 'auto') {
    lightMedia = '(prefers-color-scheme: light)';
    darkMedia = '(prefers-color-scheme: dark)';
  } else {
    lightMedia = scheme === 'light' ? ' all' : 'not all';
    darkMedia = scheme === 'dark' ? ' all' : 'not all';
  }

  lightStyles.media = lightMedia;
  darkStyles.media = darkMedia;
}

function aaa() {
  const systemScheme = getSystemScheme();
  const savedScheme = getSavedScheme();

  if (!savedScheme) return;

  if (saveScheme !== systemScheme) {
    setScheme(savedScheme);
  }
}

function getSystemScheme() {
  const darkScheme = darkSchemeMedia.matches;
  return darkScheme ? 'dark' : 'light';
}

function getSavedScheme() {
  return localStorage.getItem('color-scheme');
}

function saveScheme(scheme) {
  localStorage.setItem('color-scheme', scheme);
}

function clearScheme() {
  localStorage.removeItem('color-scheme');
}

// switcher.addEventListener('click', onSwitcherClick);

// function onSwitcherClick() {}
