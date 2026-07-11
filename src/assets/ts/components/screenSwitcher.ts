export const initScreenSwitcher = () => {
  const screens = {
    hero: document.getElementById('screen-hero'),
    media: document.getElementById('screen-media'),
    details: document.getElementById('screen-details'),
  };

  function handleRoute(): void {
    const hash = window.location.hash || '#hero';

    if (!screens.hero || !screens.media || !screens.details) return;

    screens.hero.classList.toggle('hidden', hash !== '#hero');
    screens.media.classList.toggle('hidden', hash !== '#media');
    screens.details.classList.toggle('hidden', hash !== '#details');

    console.log('Switching screen - ', hash);
  }

  window.addEventListener('hashchange', handleRoute);

  handleRoute();
};
